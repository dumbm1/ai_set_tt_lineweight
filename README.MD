Set minimal lineweight of text
===
Extension panel for Adobe illustrator cc-2020
---
with vue.js framework
---
note: 
todo:
 1. Picked symbols with max-verticals lines without rounded elements, ungularly lines ets.
    * example: `fhijlmn1tu1 FHIJLMN1TU гинптцчшщ ГИНПТЦЧШЩ`
 2. Algorithm `getMinWidth()`:
    * doublicate selected textFrame
       * `getTextFrame()`
       * executeMenuCommand('copy', 'deselectall', 'pasteFront)
       * var `frameTmpl` = selection[0]
    * set content with picked symbols
    * var `pathTmpl` = textFrame.createOutline()
    * executeMenuCommand('compoundPath')
    * var `pathTmplHeight` = pathTmpl.height
    * get dot height of target font //it's a height-filter
    * make six equal `knifeRectangles` with height = pathTmp.height \ 6
       * first and last element height += 2
    * slice with `intersect action`, delete first and last elements
    * filtered by `dotHeight`
    * return `minWidth`
 