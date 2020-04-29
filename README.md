# Performance investigate for TokenComparator
Last year I've udpate nodejs version for my app.  
From NodeJS v10.15.3 to V12.13.0.

Recently I've found that app sometimes faces serious performance problem.

I've investigated that problem.  
It seems very strange.

This is minimum reproduce program for that problem.

## What is TokenComparator
TokenComparator is a class to compare 2 files token by token.  
This is not simple diff. It ignores spaces and CRLF. It compares only tokens.

Sometimes it handles huge files. So it doesn't read entire file on memory. It reads file token by token.

## Problem
This program run with 1 file.(Compare same file token by token. So its result is always same.)

This program works with enough speed on NodeJS v10.x env.

However sometimes it is very slow on v12.x env.

Curious to say, that problem is not depend on file size.

I've attched 2 test data in this repo.

- data/random.txt -> random 200000 tokens(2MB)
- data/zero.txt -> 200000 tokens. Most of them are `0`(400KB)

The number of tokens are same. But for file size, random.txt is 5 times larger than zero.txt.

However performance for these files are totally different! Like this

```
$ node main.js data/random.txt
Prcessed: 203ms
$ node main.js data/random.txt
Prcessed: 203ms
$ node main.js data/random.txt
Prcessed: 203ms
$ node main.js data/zero.txt
Prcessed: 3746ms
$ node main.js data/zero.txt
Prcessed: 3690ms
$ node main.js data/zero.txt
Prcessed: 3727ms
```

Processing zero.txt is slower than random.txt more than 10 times.

On v10.x env, zero.txt is faster than random.txt. (I guess it depends on file size.)
Also basic performance is faster than v12.x.

```
$ node main.js data/random.txt
Prcessed: 155ms
$ node main.js data/random.txt
Prcessed: 157ms
$ node main.js data/random.txt
Prcessed: 168ms
$ node main.js data/zero.txt
Prcessed: 90ms
$ node main.js data/zero.txt
Prcessed: 89ms
$ node main.js data/zero.txt
Prcessed: 89ms
```

I've also test it on v14.0.0 env.
Its behavior is almost same as v12.x. It also has performance problem.

## Prof
I've run this program with `--prof` option.
It is stored in prof directory.

- [random.txt](prof/random.txt)
- [zero.txt](prof/zero.txt)

In zero.txt, tick count for `LazyCompile` is very larger than random.txt.
So now I'm doubting something jit bugs.

