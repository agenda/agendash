1.0.0 / 2019-02-25
====
* Add Hapi v17 middleware, drop support for Node.js v6 & v7 (#81) by umens (**BREAKING**)
* Support Agenda version 2 by alexkwolfe (**BREAKING**)

0.5.0 / 2019-02-25
====

* Update dependencies (#69, #70) (**BREAKING**)
  * Agenda `>=0.7.0 <1.0.0` → `^1.0.3` and thus require MongoDB v3+
  * async `^1.0.0` → `^2.6.0`
* Drop support for Node.js v4 and v5 (might still work but we're stopping testing these) (**BREAKING**)
* Switch testing with Mocha to [Ava](https://www.npmjs.com/package/ava) (#70)
* Docker support (#54) by WoLfulus
* Fix 404 errors when deleting and re-queuing jobs (#61) by koresar

0.4.0 / 2016-10-27
==================

  * (simison) Agenda dependency version `<1.0.0` to avoid breaking dependency.
  * (loris) Fix #24 - Added indexes for faster queries.
  * Fix #28 - Removed dependency on Mongo Driver.
  * Added API tests with mocha and supertest. No frontend tests.

0.3.2 / 2016-06-30
==================

  * (HugoCornu) Fix #19 "Schedule Job" - Don't repeat job if user didn't want it repeated

0.3.1 / 2016-04-12
==================

  * (simison) Add engines key to package.json

0.3.0 / 2016-04-04
==================

  * (bh-chaker) Schedule Job Feature - create new jobs from the UI
  * Limit to 200 jobs on page, no UI for configuration

0.2.1 / 2016-03-25
==================

  * (vziukas) Recurring job count and labels
  * Fixed "queued" label colors

0.2.0 / 2016-03-18
==================

  * (vziukas) Configurable title
  * Middleware option moved to "options" object

0.1.1 / 2016-03-17
==================

  * (vziukas) multiple instances of agendash can each have a separate agenda

0.1.0 / 2016-03-15
==================

  * (rapidia) remove "arrow function" syntax for non-chrome browsers
  * (ebourmalo) Fix the middleware usage and use a proper structure

0.0.5 / 2016-02-24
==================

  * Batch requeue and delete
  * Select All and Select None

0.0.4 / 2016-02-24
==================

  * Select multiple jobs

0.0.2 / 2016-02-23
==================

  * version bump so npm will update docs
  * Added screenshots

0.0.1 / 2016-02-23
==================

  * Initial Release
