#!/usr/bin/env python
# -*- coding: utf-8

"""Svadhyaya db file preprocessor, compact text to json."""

# Code Copyright (c) Christopher T. Haynes under the MIT License.

import sys
import json
from StringIO import StringIO
import argparse
import codecs
import re

try:
    import debug
    from pdb import set_trace as breakpoint
except:
    pass

UTF8Reader = codecs.getreader('utf8')
UTF8Writer = codecs.getwriter('utf8')


epilog = """
DB FILE PREPROCESSOR FORMAT

Extended BNF notation: -> production, <...> non-terminal, {…} grouping, [...]
optional, | or, + one or more, * zero or more, ,... non-empty comma-separated
list, other symbols terminal, spaces not significant in grammar productions
syntax. BOL/EOL beginning/end of line. EOF end of file.

See also abstract syntax context sensitive requirements.

<file> -> { <question> | <tag range> }+

<tag> is non-empty string of letters (case insensitive), digits, underscore, or
spaces (trimmed at ends).

<tag range> , [ / ] <tag>\n

Questions up to EOF or / <tag> line have <tag>.

<question> -> [ , <tag>,… ] { : | :: } <text>
                { { = <answer> } | { / <distractor> } }+
                [ ? <hint>
              ]*

<text>, <hint>, <answer>, and <distractor> are strings.

:: for multi-line format: =, / and ? above must be at start of line, questions end with EOF or next line beginning with a colon or comma.

: single-line format: EOL ends question and no =, / or ? in <answer>, no = or / in <text>, and no ? in <hint> .

If no answer or distractors, then it is a sequence question, whose mind answer is the next question.
If answer is True, False, T or F (case insensitive), then true/false question.
If answer, but no distractors, then mind question.
If multiple answers, then multiple-choices question.
Otherwise, multiple-choice question.


SPECIAL TAGS

.lineseq : each line of multi-line question text is a sequence answer
.text : preferatory text, not a question
.md : text is in markdown format
.case_sensitive : responses are case sensitive

One tag may be a non-negative decimal number (e.g. difficulty rating).


JSON FORMAT

Quiz questions json format is list of question dictionaries with keys:
type: string=true-false, multiiple-choice, multiple-choices, sequence, or mind
question: text of question
responses: list of (is_answer, response) pairs, where response is text or,
           if a true-false question, the boolean answer
tag: list of tag strings
hints: list of hint strings
number: difficulty number
"""

tag_re = r'[a-zA-Z0-9_ ]+'
tags_cre = re.compile(r',('+tag_re+r')+?')
tagrange_cre = re.compile(r',(/)?('+tag_re+r')\n')
line_question_cre = re.compile(r'(.*)([=/][^?]*)(\?.*)')
mline_question_cre = re.compile(r':(.*)(^[=/].*?)*(^\?.*)(?:\n[,:])',
                                re.MULTILINE)
number_cre = re.compile(r'.\d+|\d+.\d*|\d+')

def isnumber(string):
    return number_cre.match(string)

text = None
orig_text = None
def error(msg):
    line_num = len(orig_text[:-len(text)].split('\n'))
    full_msg = 'ERROR at line ' + str(line_num) + ': ' + msg
    sys.stderr.writeln(full_msg)
    exit()

def main(args):
    """Command line invocation with argparse args."""
    if args.outfile:
        writer = UTF8Writer(args.outfile)
    else:
        writer = sys.stdout
    if args.test:
        text = test
    else:
        text = args.infile.read()
    orig_text = text

    tags = set()
    quiz = []
    while True:
        if not text:
            break
        reo = tagrange_cre.match(text)
        if reo:
            slash, tag = reo.groups()
            tag = tag.strip()
            if slash:
                if tag not in tags:
                    error('closing tag without opening')
                tags.remove(tag)
            elif tag in tags:
                error('tag already active')
            else:
                tags.add(tag)
        else:
            if ':' not in text:
                error('no question')
            qtags = []
            tags_str, text = text.split(':', 1)
            if not text:
                error('no question body')
            multiline = text[0] == ':'
            if tags_str == ',':
                reo = tags_cre.match(tags_str)
                if not reo:
                    error('bad tags format')
                if tags_str:
                    qtags = set([tag.strip() for tag in tags_str.split(',')[1:]])
                else:
                    qtags = set()
                qtags |= tags
            numbers = filter(isnumber, qtags)
            if len(numbers) > 1:
                error('number tag already present')
            if multiline:
                reo = mline_question_cre.match(text)
            else:
                reo = line_question_cre.match(text)
            if not reo:
                error('ill formed question')
            question, responses_str, hints_str = reo.groups()
            responses = [(r[0] == '=', r[1:],strip())
                         for r in re.findall(r'[/=][^/=]*', responses_str)]
            if not responses:
                _type = 'sequence'
            elif len(responses) == 1:
                _type = 'true-false'
                if responses[0][0]:
                    response = responses[0][1].lower()
                    if response in ['t', 'f', 'true', 'false']:
                        responses[0][1] = response in ['t', 'true']
                    else:
                        error('not a true/false answer')
                else:
                    error('no answer')
            elif len(filter(None, map(lambda r: r[0], responses))) == 1:
                _type = 'multiple-choice'
            else:
                _type = 'multiple-choices'
            quiz.append({'question': question.strip(),
                         'number': float(numbers[0]) if numbers else None,
                         'hints': hints_str.split('?')[1:],
                         'tags': filter(lambda t: not isnumber(t), qtags),
                         'responses': responses,
                         'type': _type
                        })
        text = text[reo.end():]
    json.dump(quiz, writer)

def get_args():
    formatter = argparse.RawDescriptionHelpFormatter
    p = argparse.ArgumentParser(
        description=__doc__,
        epilog=epilog,
        formatter_class=formatter)
    p.add_argument('infile', nargs='?', default='-',
                   type=str,
                   help='compact format input file, default stdin (-)')
    p.add_argument('outfile', nargs='?', default=None,
                   type=argparse.FileType('w'),
                   help='json format file, default stdout')
    p.add_argument('-t', '--test', action='store_true',
                   help='run with test variable value as input')
    args = p.parse_args()
    if args.infile == '-':
        args.infile = sys.stdin
    args.infile = UTF8Writer(args.infile)
    return args

sys.stdout = UTF8Writer(sys.stdout)

test = """,foo
:qtext=a/b
,bar:q=t
,a,1:qt
,/foo
::mq
/a
=b
,c::mcq
"""

if __name__ == "__main__":
    main(get_args())
