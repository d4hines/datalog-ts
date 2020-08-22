# datalog-ts

A tiny (<100 LOC), toy implementation of Datalog. I can't take much credit - it's mostly a faithful translation of 
@rntz's [Racket implementation](https://github.com/rntz/minikanren-datalog/blob/master/datalog.rkt). The one
elaboration is I add negation; however, I don't enforce stratification, so it's possible to get inconsistent
results if you give a bad query.
