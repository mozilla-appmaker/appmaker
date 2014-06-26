/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.

This handles...
- Switching between expanded left tray and view source modes
- Customize vs View Source in the right tray
- View Source menu switching (HTML vs CSS vs JS, etc.)
*/

define(
  ["jquery", "analytics"],function($, analytics) {
    "use strict";

    //Open components modal
    $('.expand-handle.expand-left').click(function () {
      $(".page-wrapper").toggleClass("left-closed");
      analytics.event("Used Expand Handle", {label: "Components Tray"});
    });

    $('.expand-handle.expand-right').click(function () {
      $(".page-wrapper").toggleClass("right-closed");
      analytics.event("Used Expand Handle", {label: "Options Tray"});
    });

    /* Customize vs View Source Toggle */

    $(".tray-tabs").on("click","a",function(){
      var tab = $(this).attr("tab");
      changeEditableTab(tab);
      return false;
    });

    function changeEditableTab(tab) {
      $(".tray-tabs").find("a").removeClass("selected-tab");
      $(".tray-tabs [tab='"+tab+"']").addClass("selected-tab");
      $(".tab-sections .section").hide();
      $(".tab-sections .section-" + tab).show();
      $(".tab-sections .section-" + tab + " textarea").focus();
      if(tab == "view-source"){
      } else {
        if($(".right-column").not(".remix-mode").length == 1){
        }
      }
    }

    // View source menu
    $(".view-source-menu").on("click","a",function(){
      var sourceType = $(this).attr("source");
      switchSourceView(sourceType);
    });

    function switchSourceView(view) {
      $(".view-source-menu a").removeClass("selected");
      $(".view-source-menu a[source='" + view + "']").addClass("selected");
      $(".view-source-items .source-type").hide();
      $(".view-source-items [source='" + view + "']").show();
    }

    $(".view-source-items textarea").on("keyup",function(){
      $(".right-column").addClass("remix-mode");
      $(".remix-helper").hide();
    });

    /* Defaults */
    switchSourceView("HTML");
    changeEditableTab("customize");

    /* Remix UI Stuff */
    $(".remix-ui a.finish-remix, .remix-ui a.cancel-remix").on("click",function(){
      $(".right-column").removeClass("remix-mode");
      changeEditableTab("customize");
    });
  }
);
