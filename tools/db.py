#!/usr/bin/env python
# -*- coding: utf-8

"""Svadhyaya question preprocessor: compact text to json."""

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

debug_mode = False

UTF8Reader = codecs.getreader('utf8')
UTF8Writer = codecs.getwriter('utf8')


epilog = """
QUESTION PREPROCESSOR FORMAT

Notation: Grammar rules are of the form ELEMENT_TYPE -> GRAMMAR_EXPRESSION.
A grammar expression may contain the following notation.
{...} grouping, [...] optional, | or, +/* one/zero or more of the preceding form.
,... non-empty comma-separated sequence of preceding form.
Spaces are not significant in grammar rules. Sequences are non-empty.
BOL/EOL beginning/end of line. EOF end of file.

INPUT -> { QUESTION | TAG_RANGE } +

QUESTION -> BOL ; [ TAG,... ] ; TEXT
                { == ANSWER } | // DISTRACTOR } *
                { ?? HINT } *

TEXT, ANSWER, DISTRACTOR, and HINT are strings in which ==, //, and ?? may not appear.

If no answer or distractors, then it is a sequence question, whose mind answer is the next question. If multiple answers, then multiple-choices question.
Otherwise, if one or more distractors, then multiple-choice question.
If one answer and no distractors, then if answer is True, False, T or F (case insensitive), then true/false question, and otherwise mind answer question.

TAG is a sequence of letter (case insensitive), digit, dot, underscore, or
space characters. Spaces are trimmed at both ends.

TAG_RANGE -> BOL ; [ / ] TAG EOL

A ;tag line tag range is terminated by EOF or a ;/tag line.
Questions in a tag range all have its tag.

A numeric tag has the form of an unsigned non-negataive number with optional decimal point. A question may not have more than one numeric tag.

SPECIAL TAGS

.lineseq : each line of question text is a sequence question
.text : preferatory text, not a question
.md : text is in markdown format
.case_sensitive : response is case sensitive


JSON FORMAT

Quiz questions json format is list of question dictionaries with keys:
type: string=true-false, multiiple-choice, multiple-choices, sequence, or mind
text: text of question
responses: list of (is_answer, response) pairs, where response is text or,
           if a true-false question, the boolean answer
tag: list of tag strings
hints: list of hint strings
number: difficulty number
"""

q_split_cre = re.compile(r'(\r)(?=//|==)')
number_cre = re.compile(r'.\d+|\d+.\d*|\d+')
isnumber = number_cre.match

def istag(string):
    return filter(None, [c.isalnum() or c in '._ ' for c in string])

line_num = 1
def error(msg):
    sys.stderr.write('ERROR at line ' + str(line_num) + ': ' + msg + '\n')
    if debug_mode:
        breakpoint()
    else:
        exit()

def main(args):
    """Command line invocation with argparse args."""
    global debug_mode, line_num
    if args.outfile:
        writer = UTF8Writer(args.outfile)
    else:
        writer = sys.stdout
    _input = None
    if args.test:
        _input = test
        debug_mode = True
    else:
        _input = args.infile.read()
    if not _input.startswith(';'):
        error('input must start with semicolon')

    tags = set()
    quiz = []
    for elt in _input[1:].split('\n;'):
        elt = elt.strip()
        if not elt:
            error('bad syntax')
        if ';' not in elt:  ## tag range
            if elt.startswith('/'):
                tag = elt[1:]
                if not istag(tag):
                    error('bad range tag')
                if tag not in tags:
                    error('closing tag without opening')
                tags.remove(tag)
            else:
                tag = elt.strip()
                if tag in tags:
                    error('tag already active')
                else:
                    tags.add(tag)
        else:
            tags_str, question = elt.split(';', 1)
            if not question:
                error('no question body')
            qtaglst = filter(None, map(str.strip, tags_str.split(',')))
            if filter(None, [not istag(tag) for tag in qtaglst]):
                error('bad tag')
            qtags = set(qtaglst)
            intersection = qtags & tags
            if intersection:
                error('tag(s) in context: ' + str(intersection))
            qtags |= tags
            numbers = filter(isnumber, qtags)
            if len(numbers) > 1:
                error('number tag already present')
            lst = map(str.strip, re.split(r'\n(?=??)', question))
            hints = lst[1:]
            lst = re.split(r'(\r)(?=//|==)', lst[0])
            text = lst[0]
            responses = [(r[0] == '==', r[2:]) for r in lst[1:]]
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
            quiz.append({'text': text,
                         'number': float(numbers[0]) if numbers else None,
                         'hints': hints,
                         'tags': filter(lambda t: not isnumber(t), qtags),
                         'responses': responses,
                         'type': _type
                        })
        line_num += len(elt.split('\n')) + 1
    json.dump(quiz, writer, indent=4)  ## indent=None for compact form

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

test = """;foo
;;qtext==a//b
;bar;q==t
;a,1;qt
;/foo
;;mq
//a
==b
;c;mcq
;.lineseq;
one
two
three
"""

if __name__ == "__main__":
    main(get_args())
