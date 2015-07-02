#!/usr/bin/env python

"""Svadhyaya db file preprocessor, compact text to json."""

# Code Copyright (c) Christopher T. Haynes under the MIT License.

import sys
import json
from StringIO import StringIO
import argparse
import codecs

try:
    import debug
    from pdb import set_trace as breakpoint
except:
    pass

UTF8Reader = codecs.getreader('utf8')
UTF8Writer = codecs.getwriter('utf8')


epilog = """
DB FILE PREPROCESSOR FORMAT

Extended BNF notation: -> production, <...> non-terminal, {…} grouping, [...] optional, | or, + one or more, * zero or more, ,... non-empty comma-separated list, other symbols terminal, spaces not significant in grammar productions syntax. BOL/EOL beginning/end of line. EOF end of file.

See also abstract syntax context sensitive requirements.

<file> -> { <question> | <tag range> }+

<tag> is non-empty string of letters (case insensitive), digits, underscore, or spaces (trimmed at ends).

<tag range> ,, [ / ] <tag>

Questions up to EOF or / <tag> line have <tag>.

<question> -> [ , <tag>,… ] { : | :: } <text> { { = <answer> } | { / <distractor> } }+ [ ? <hint> ]*

<text>, <hint>, <answer>, and <distractor> are strings.

:: for multi-line format: =, / and ? above must be at start of line, questions end with EOF or next line beginning with a colon or comma.

: single-line format: EOL ends question and no =, / or ? in <answer>, no = or / in <text>, and no ? in <hint> .

If answer is True, False, T or F (case insensitive), then true/false question.
If no distractors, then mind question.
If multiple answers, then multiple-choices question.
Otherwise, multiple-choice question.


SPECIAL TAGS

.seq : sequence (each element is answer of previous and question on next)
.lineseq : each following line of multi-line question is a sequence answer
.text : preferatory text, not a question
.md : text is in markdown format
.case_sensitive : responses are case sensitive

One tag may be a non-negative decimal number (e.g. difficulty rating).


JSON FORMAT

Quiz questions json format is list of question dictionaries with keys:
type: string=true-false, multiiple-choice, multiple-choices, or mind
question: text of question
answer: Response or list of Response
tag: list of tag strings
hints: list of hint strings
number: difficulty number
"""

test = """line 1
line 2
"""

tag_re = r'[a-zA-Z0-9_ ]+'
tags_cre = re.compile(r'(,'+tag_re+'+)?:(:)(.*)')
tagrange_cre = re.compile(r',,(/)?('+tag_re+') *\n(.*)')
line_question_cre = re.compile(r'(.*)([=/][^?]*)(\?.*)')
multiline_question_cre = re.compile(r'', re.MULTILINE)
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
        reo = tagerange_cre.match(text)
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
            reo = tags_cre.match(text)
            if not reo:
                error('not start of question')
            tags_str, multiline = reo.groups()
            if tags_str:
                qtags = set([tag.strip() for tag in tags_str.split(',')[1:]])
            else:
                qtags = set()
            qtags |= tags
            numbers = filter(isnumber, qtags)
            if len(numbers) > 1:
                error('number tag already present')
            if multiline:
                reo = multiline_question_cre.match(text)
            else:
                reo = line_question_cre.match(text)
            if not reo:
                error('ill formed question')
            question, responses_str, hints_str = reo.groups()
            quiz.append({'question': question,
                         'number': float(numbers[0]) if numbers else None,
                         'hints': hints_str.split('?')[1:],
                         'tags': filter(lambda t: not isnumber(t), qtags),
                         'responses': re.findall(r'[/=][^/=]*', responses_str)
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
                   help='run trans.test() first')
    args = p.parse_args()
    if args.infile == '-':
        args.infile = sys.stdin
    args.infile = UTF8Writer(args.infile)
    return args

sys.stdout = UTF8Writer(sys.stdout)

if __name__ == "__main__":
    main(get_args())
