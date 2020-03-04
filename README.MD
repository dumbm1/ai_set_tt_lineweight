 set tt lineweight
 ===
widget to adobe illustrator cc-2020
---
on vue.js framework
---

todo:
 1. Picked symbols with max-verticals lines without rounded elements, ungularly lines ets
 example: `ifhijlmn1tu1 IFHIJLMN1TU` и  `гинптцчшщ1 ГИНПТЦЧШЩ1`
 2. Algorithm `getMinWidth()`:
    * doublicate selected textFrame
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
 