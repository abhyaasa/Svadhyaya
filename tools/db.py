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

:: for multi-line format: =, / and ? above must be at start of line, questions end with EOF or next line beginning with : , :: , or , .

: single-line format: EOL ends question and no =, / or ? in <answer>, no = or / in <text>, and no ? in <hint> .

If answer is True, False, T or F (case insensitive), then true/false question.

SPECIAL TAGS

.seq : sequence (each element is answer of previous and question on next)
.lineseq : each following line of multi-line question is a sequence answer
.text : preferatory text, not a question
.md : text is in markdown format

One tag may be a decimal number (e.g. difficulty rating).


JSON FORMAT

Quiz questions json format is list of Text or Question

Text, Question, etc are dictionaries with _class attribute with same (lower case) name.

Text
.text string (dict has .text key with string value)

Question
.type string=true-false or multiiple-choice or mind
.answer Response or list of Response
.tag list of tag strings
.hints list of hint strings

Response
.is_answer=boolean
.text string
"""

test = """line 1
line 2
"""

tag_re = r'[a-zA-Z0-9_ ]+'
tags_cre = re.compile(r'')
tagrange_cre = re.compile(r',,(/)?('+tag_re+') *\n(.*)', re.MULTILINE)

def main(args):
    """Command line invocation with argparse args."""
    if args.outfile:
        writer = UTF8Writer(args.outfile)
    else:
        writer = sys.stdout
    if args.test:
        ctext = test
    else:
        ctext = args.infile.read()
    orig_ctext = ctext
    def error(txt):
        line_num = len(orig_ctext[:-len(ctext)].split('\n'))
        error_msg = 'ERROR at line ' + str(line_num) + ': ' + txt
        sys.stderr.writeln(error_msg)
        exit()

    tags = set()
    result = []
    while True:
        if not ctext:
            break
        tagrange_reo = tagerange_cre.match(ctext)
        if tagrange_reo:
            slash, tag, ctext = tagrange_reo.groups()
            if slash:
                if tag not in tags:
                    error('closing tag without opening')
                tags.remove(tag)
            else:
                tags.add(tag)
        else:

        if not text_reo:
            break

            text = text_reo ###
        tags_reo = tags_cre.match(ctext)

    json.dump(result, writer)

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
