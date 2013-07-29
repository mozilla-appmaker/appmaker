/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log('we be here?')
  res.render('index.ejs');
};