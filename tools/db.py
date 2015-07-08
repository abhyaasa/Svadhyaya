#!/usr/bin/env python2.6
# -*- coding: utf-8
# Code Copyright (c) Christopher T. Haynes under the MIT License.
"""Svadhyaya question preprocessor: compact text to json."""

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

epilog = """QUESTION PREPROCESSOR FORMAT

Notation: Grammar rules are of the form ELEMENT_TYPE -> GRAMMAR_EXPRESSION.
A grammar expression may contain the following notation.
{...} grouping, [...] optional, | or, +/* one/zero or more of the preceding form.
,... non-empty comma-separated sequence of preceding form.
Spaces are not significant in grammar rules. Sequences are non-empty.
BOL/EOL beginning/end of line. EOF end of file.

INPUT -> { QUESTION | TAG_RANGE } +

QUESTION -> BOL ; [ TAG,... ] ; TEXT
                { <ws>= ANSWER } | <ws>/ DISTRACTOR } *
                { <ws>? HINT } *
where

TEXT, ANSWER, DISTRACTOR, and HINT are strings in which the <ws> prefixed sequences above may not appear. This may be avoided by using \?, \=, or \/, with the backslash escape characters removed after parsing.

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

.lineseq : all but last line of question text is a sequence question
           (at least two lines required, and no responses or hints allowed)
.text : preferatory text, not a question
.md : question, response, and hints text is in markdown format
      (requires markdown module and associated python version)
.html : text is in html format
.case_sensitive : response is case sensitive


JSON FORMAT

Quiz questions json format is list of question dictionaries with keys:
type: string = text, true-false, multiiple-choice, multiple-choices,
      sequence, or mind
text: text of question
responses (not text, t/f, sequence or mind type):
          list of (is_answer, response_text) pairs
answer (t/f or mind type): boolean (t/f) or text (mind)
tag: list of tag strings
hints (if any): list of hint strings
number (if any): difficulty number

Dependencies: python 2.6 with markdown module installed
(http://pythonhosted.org/Markdown/index.html). If .md tag is not used,
markdown is not needed. Should work with later, and some earlier, python2.x provided markdown is available if needed.

TODO: add unicode support
"""

number_cre = re.compile(r'.\d+|\d+.\d*|\d+')
isnumber = number_cre.match

def istag(string):
    return filter(None, [c.isalnum() or c in '._ ' for c in string])

def main(args):
    """Command line invocation with argparse args."""
    debug_mode = False
    tags = set()
    line_num = 1

    def error(msg):
        sys.stderr.write('ERROR at line ' + str(line_num) + ': ' + msg + '\n')
        if debug_mode:
            breakpoint()
        else:
            exit()

    def do_text(text):
        if markdown_mode:
            text = str(Markdown.convert(text))
        return re.sub(r'\\([=/]?)', r'\1', text.strip())

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
    if '.md' in _input:
        import markdown
        Markdown = markdown.Markdown
        
    quiz = []
    for elt in _input[1:].split('\n;'):
        markdown_mode = False
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
            q = {}
            tags_str, question = elt.split(';', 1)

            # tag processing
            qtaglst = filter(None, map(do_text, tags_str.split(',')))
            if filter(None, [not istag(tag) for tag in qtaglst]):
                error('bad tag')
            qtags = set(qtaglst)
            intersection = qtags & tags
            if intersection:
                error('tag(s) in context: ' + str(intersection))
            qtags |= tags
            if '.md' in qtags:
                markdown_mode = True
                qtags.remove('.md')
            q['tags'] = filter(lambda t: not isnumber(t), qtags)
            numbers = filter(isnumber, qtags)
            if len(numbers) > 1:
                error('number tag already present')
            elif len(numbers) == 1:
                q['number'] = float(numbers[0])

            # question/response processing
            if not question:
                error('no question body')
            qlst = re.split(r'\s\?', question)
            hints = map(do_text, qlst[1:])
            if hints:
                q['hints'] = hints
            trlst = re.split(r'\s(?==)|\s(?=/)', qlst[0])
            q['text'] = do_text(trlst[0])
            responses = [(r[0] == '=', do_text(r[1:])) for r in trlst[1:]]
            if '.text' in qtags:
                if responses or hints:
                    error('no hints or responses in text mode')
                q['type'] = 'text'
            elif '.lineseq' in qtags:
                if responses or hints:
                    error('no responses or hints in .lineseq mode')
                lines = map(do_text, q['text'].split('\n'))
                if len(lines) < 2:
                    error('at least two lines in .lineseq mode')
                for line in lines[:-2]:
                    quiz.append({'text': line,
                                 'tags': q['tags'],
                                 'type': 'sequence'
                                })
                q['type'] = 'mind'
                q['text'] = lines[-2]
                q['answer'] = lines[-1]
            elif not responses:
                q['type'] = 'sequence'
            elif len(responses) == 1:
                if not responses[0][0]:
                    error('no answer')
                response = responses[0][1]
                if response.lower() in ['t', 'f', 'true', 'false']:
                    q['type'] = 'true-false'
                    q['answer'] = response.lower() in ['t', 'true']
                else:
                    q['type'] = 'mind'
                    q['answer'] = response
            else:
                q['responses'] = responses
                if len(filter(None, map(lambda r: r[0], responses))) == 1:
                    q['type'] = 'multiple-choice'
                else:
                    q['type'] = 'multiple-choices'
            quiz.append(q)
        line_num += len(elt.split('\n')) + 1
    json.dump(quiz, writer, indent=1, sort_keys=True)

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
;;qtext =a /b
;bar;q =t
;a,1;qt
;;q with
?    hint \?questionmark
;/foo
;;mq
/a
=b
;c;mcq
;;mind =answer a \= b
;.lineseq;
one
two
three
"""

if __name__ == "__main__":
    main(get_args())
