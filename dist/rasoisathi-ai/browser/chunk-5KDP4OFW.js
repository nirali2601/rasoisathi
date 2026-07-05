import{a as Vt}from"./chunk-4ONGL5JT.js";import{b as Qe,c as Ye,d as Ue,e as $e,f as Xe,g as Je,h as Ze,i as et,j as ee,k as tt,l as it,m as ut,p as ft,r as gt,s as _t,t as bt,u as se,v as vt,w as yt,x as xt,y as Ct}from"./chunk-YDDK2MBD.js";import{a as At}from"./chunk-EYPXMCZF.js";import{a as Dt}from"./chunk-SUXZFWKM.js";import{a as kt}from"./chunk-4X2GAX6J.js";import{a as Ge}from"./chunk-YIEXJKIK.js";import{b as Mt,c as St,j as wt,o as Ot,q as Ce,r as ke,s as Et,t as It}from"./chunk-7EN3OMAS.js";import{a as Rt,b as Tt,c as Pt,d as Ft}from"./chunk-QWWWYURZ.js";import"./chunk-IHCNKWB4.js";import"./chunk-ZAQJCETW.js";import{a as He,d as qe}from"./chunk-NWLSJVUJ.js";import{B,C as st,D as te,E as lt,F as xe,N as ie,Q as ct,R as dt,S as mt,T as pt,U as z,V as ht,W as ne,X as ae,Y as oe,Z as re,n as nt,s as at,t as ot,z as rt}from"./chunk-442PSIEZ.js";import{$b as v,Ab as b,Bb as $,Cb as ge,D as De,Db as _e,Hb as V,Ib as Le,Lb as u,M as ue,Mb as p,N as fe,Nb as X,O as T,Ob as N,Pa as Fe,Pb as Be,Qb as J,Ra as l,Rb as C,Sb as k,V as P,Wb as ze,X as E,Yb as M,Z as d,Za as Ae,Zb as We,_b as c,ac as O,ca as I,cc as be,da as D,ea as Re,eb as f,ec as Ke,fb as A,g as S,ga as Te,ka as F,kb as Ve,mb as Ne,nc as je,oc as ve,pa as Q,pc as L,q as pe,qb as w,rb as g,sb as _,sc as Z,ta as Pe,ub as U,uc as x,v as Ie,vb as j,vc as ye,wa as Y,wb as H,x as G,xb as h,y as he,yb as s,zb as r}from"./chunk-CEELXM2A.js";var q=class{_multiple;_emitChanges;compareWith;_selection=new Set;_deselectedToEmit=[];_selectedToEmit=[];_selected=null;get selected(){return this._selected||(this._selected=Array.from(this._selection.values())),this._selected}changed=new S;constructor(a=!1,e,t=!0,i){this._multiple=a,this._emitChanges=t,this.compareWith=i,e&&e.length&&(a?e.forEach(o=>this._markSelected(o)):this._markSelected(e[0]),this._selectedToEmit.length=0)}select(...a){this._verifyValueAssignment(a),a.forEach(t=>this._markSelected(t));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}deselect(...a){this._verifyValueAssignment(a),a.forEach(t=>this._unmarkSelected(t));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}setSelection(...a){this._verifyValueAssignment(a);let e=this.selected,t=new Set(a.map(o=>this._getConcreteValue(o)));a.forEach(o=>this._markSelected(o)),e.filter(o=>!t.has(this._getConcreteValue(o,t))).forEach(o=>this._unmarkSelected(o));let i=this._hasQueuedChanges();return this._emitChangeEvent(),i}toggle(a){return this.isSelected(a)?this.deselect(a):this.select(a)}clear(a=!0){this._unmarkAll();let e=this._hasQueuedChanges();return a&&this._emitChangeEvent(),e}isSelected(a){return this._selection.has(this._getConcreteValue(a))}isEmpty(){return this._selection.size===0}hasValue(){return!this.isEmpty()}sort(a){this._multiple&&this.selected&&this._selected.sort(a)}isMultipleSelection(){return this._multiple}_emitChangeEvent(){this._selected=null,(this._selectedToEmit.length||this._deselectedToEmit.length)&&(this.changed.next({source:this,added:this._selectedToEmit,removed:this._deselectedToEmit}),this._deselectedToEmit=[],this._selectedToEmit=[])}_markSelected(a){a=this._getConcreteValue(a),this.isSelected(a)||(this._multiple||this._unmarkAll(),this.isSelected(a)||this._selection.add(a),this._emitChanges&&this._selectedToEmit.push(a))}_unmarkSelected(a){a=this._getConcreteValue(a),this.isSelected(a)&&(this._selection.delete(a),this._emitChanges&&this._deselectedToEmit.push(a))}_unmarkAll(){this.isEmpty()||this._selection.forEach(a=>this._unmarkSelected(a))}_verifyValueAssignment(a){a.length>1&&this._multiple}_hasQueuedChanges(){return!!(this._deselectedToEmit.length||this._selectedToEmit.length)}_getConcreteValue(a,e){if(this.compareWith){e=e??this._selection;for(let t of e)if(this.compareWith(a,t))return t;return a}else return a}};var Nt=(()=>{class n{_animationsDisabled=ie();state="unchecked";disabled=!1;appearance="full";constructor(){}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=f({type:n,selectors:[["mat-pseudo-checkbox"]],hostAttrs:[1,"mat-pseudo-checkbox"],hostVars:12,hostBindings:function(t,i){t&2&&M("mat-pseudo-checkbox-indeterminate",i.state==="indeterminate")("mat-pseudo-checkbox-checked",i.state==="checked")("mat-pseudo-checkbox-disabled",i.disabled)("mat-pseudo-checkbox-minimal",i.appearance==="minimal")("mat-pseudo-checkbox-full",i.appearance==="full")("_mat-animation-noopable",i._animationsDisabled)},inputs:{state:"state",disabled:"disabled",appearance:"appearance"},decls:0,vars:0,template:function(t,i){},styles:[`.mat-pseudo-checkbox {
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 0.1), background-color 90ms cubic-bezier(0, 0, 0.2, 0.1);
}
.mat-pseudo-checkbox::after {
  position: absolute;
  opacity: 0;
  content: "";
  border-bottom: 2px solid currentColor;
  transition: opacity 90ms cubic-bezier(0, 0, 0.2, 0.1);
}
.mat-pseudo-checkbox._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-pseudo-checkbox._mat-animation-noopable::after {
  transition: none;
}

.mat-pseudo-checkbox-disabled {
  cursor: default;
}

.mat-pseudo-checkbox-indeterminate::after {
  left: 1px;
  opacity: 1;
  border-radius: 2px;
}

.mat-pseudo-checkbox-checked::after {
  left: 1px;
  border-left: 2px solid currentColor;
  transform: rotate(-45deg);
  opacity: 1;
  box-sizing: content-box;
}

.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {
  color: var(--mat-pseudo-checkbox-minimal-selected-checkmark-color, var(--mat-sys-primary));
}
.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {
  color: var(--mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}

.mat-pseudo-checkbox-full {
  border-color: var(--mat-pseudo-checkbox-full-unselected-icon-color, var(--mat-sys-on-surface-variant));
  border-width: 2px;
  border-style: solid;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-disabled {
  border-color: var(--mat-pseudo-checkbox-full-disabled-unselected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate {
  background-color: var(--mat-pseudo-checkbox-full-selected-icon-color, var(--mat-sys-primary));
  border-color: transparent;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {
  color: var(--mat-pseudo-checkbox-full-selected-checkmark-color, var(--mat-sys-on-primary));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled {
  background-color: var(--mat-pseudo-checkbox-full-disabled-selected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {
  color: var(--mat-pseudo-checkbox-full-disabled-selected-checkmark-color, var(--mat-sys-surface));
}

.mat-pseudo-checkbox {
  width: 18px;
  height: 18px;
}

.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after {
  width: 14px;
  height: 6px;
  transform-origin: center;
  top: -4.2426406871px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {
  top: 8px;
  width: 16px;
}

.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after {
  width: 10px;
  height: 4px;
  transform-origin: center;
  top: -2.8284271247px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {
  top: 6px;
  width: 12px;
}
`],encapsulation:2,changeDetection:0})}return n})();var Qt=["text"],Yt=[[["mat-icon"]],"*"],Ut=["mat-icon","*"];function $t(n,a){if(n&1&&b(0,"mat-pseudo-checkbox",1),n&2){let e=p();h("disabled",e.disabled)("state",e.selected?"checked":"unchecked")}}function Xt(n,a){if(n&1&&b(0,"mat-pseudo-checkbox",3),n&2){let e=p();h("disabled",e.disabled)}}function Jt(n,a){if(n&1&&(s(0,"span",4),c(1),r()),n&2){let e=p();l(),O("(",e.group.label,")")}}var Se=new E("MAT_OPTION_PARENT_COMPONENT"),we=new E("MatOptgroup");var Me=class{source;isUserInput;constructor(a,e=!1){this.source=a,this.isUserInput=e}},W=(()=>{class n{_element=d(Y);_changeDetectorRef=d(Z);_parent=d(Se,{optional:!0});group=d(we,{optional:!0});_signalDisableRipple=!1;_selected=!1;_active=!1;_mostRecentViewValue="";get multiple(){return this._parent&&this._parent.multiple}get selected(){return this._selected}value;id=d(te).getId("mat-option-");get disabled(){return this.group&&this.group.disabled||this._disabled()}set disabled(e){this._disabled.set(e)}_disabled=Q(!1);get disableRipple(){return this._signalDisableRipple?this._parent.disableRipple():!!this._parent?.disableRipple}get hideSingleSelectionIndicator(){return!!(this._parent&&this._parent.hideSingleSelectionIndicator)}onSelectionChange=new F;_text;_stateChanges=new S;constructor(){let e=d(at);e.load(dt),e.load(ot),this._signalDisableRipple=!!this._parent&&Ne(this._parent.disableRipple)}get active(){return this._active}get viewValue(){return(this._text?.nativeElement.textContent||"").trim()}select(e=!0){this._selected||(this._selected=!0,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}deselect(e=!0){this._selected&&(this._selected=!1,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}focus(e,t){let i=this._getHostElement();typeof i.focus=="function"&&i.focus(t)}setActiveStyles(){this._active||(this._active=!0,this._changeDetectorRef.markForCheck())}setInactiveStyles(){this._active&&(this._active=!1,this._changeDetectorRef.markForCheck())}getLabel(){return this.viewValue}_handleKeydown(e){(e.keyCode===13||e.keyCode===32)&&!B(e)&&(this._selectViaInteraction(),e.preventDefault())}_selectViaInteraction(){this.disabled||(this._selected=this.multiple?!this._selected:!0,this._changeDetectorRef.markForCheck(),this._emitSelectionChangeEvent(!0))}_getTabIndex(){return this.disabled?"-1":"0"}_getHostElement(){return this._element.nativeElement}ngAfterViewChecked(){if(this._selected){let e=this.viewValue;e!==this._mostRecentViewValue&&(this._mostRecentViewValue&&this._stateChanges.next(),this._mostRecentViewValue=e)}}ngOnDestroy(){this._stateChanges.complete()}_emitSelectionChangeEvent(e=!1){this.onSelectionChange.emit(new Me(this,e))}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=f({type:n,selectors:[["mat-option"]],viewQuery:function(t,i){if(t&1&&J(Qt,7),t&2){let o;C(o=k())&&(i._text=o.first)}},hostAttrs:["role","option",1,"mat-mdc-option","mdc-list-item"],hostVars:11,hostBindings:function(t,i){t&1&&u("click",function(){return i._selectViaInteraction()})("keydown",function(m){return i._handleKeydown(m)}),t&2&&(Le("id",i.id),w("aria-selected",i.selected)("aria-disabled",i.disabled.toString()),M("mdc-list-item--selected",i.selected)("mat-mdc-option-multiple",i.multiple)("mat-mdc-option-active",i.active)("mdc-list-item--disabled",i.disabled))},inputs:{value:"value",id:"id",disabled:[2,"disabled","disabled",x]},outputs:{onSelectionChange:"onSelectionChange"},exportAs:["matOption"],ngContentSelectors:Ut,decls:8,vars:5,consts:[["text",""],["aria-hidden","true",1,"mat-mdc-option-pseudo-checkbox",3,"disabled","state"],[1,"mdc-list-item__primary-text"],["state","checked","aria-hidden","true","appearance","minimal",1,"mat-mdc-option-pseudo-checkbox",3,"disabled"],[1,"cdk-visually-hidden"],["aria-hidden","true","mat-ripple","",1,"mat-mdc-option-ripple","mat-focus-indicator",3,"matRippleTrigger","matRippleDisabled"]],template:function(t,i){t&1&&(X(Yt),g(0,$t,1,2,"mat-pseudo-checkbox",1),N(1),s(2,"span",2,0),N(4,1),r(),g(5,Xt,1,1,"mat-pseudo-checkbox",3),g(6,Jt,2,1,"span",4),b(7,"div",5)),t&2&&(_(i.multiple?0:-1),l(5),_(!i.multiple&&i.selected&&!i.hideSingleSelectionIndicator?5:-1),l(),_(i.group&&i.group._inert?6:-1),l(),h("matRippleTrigger",i._getHostElement())("matRippleDisabled",i.disabled||i.disableRipple))},dependencies:[Nt,ct],styles:[`.mat-mdc-option {
  -webkit-user-select: none;
  user-select: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  min-height: 48px;
  padding: 0 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  color: var(--mat-option-label-text-color, var(--mat-sys-on-surface));
  font-family: var(--mat-option-label-text-font, var(--mat-sys-label-large-font));
  line-height: var(--mat-option-label-text-line-height, var(--mat-sys-label-large-line-height));
  font-size: var(--mat-option-label-text-size, var(--mat-sys-body-large-size));
  letter-spacing: var(--mat-option-label-text-tracking, var(--mat-sys-label-large-tracking));
  font-weight: var(--mat-option-label-text-weight, var(--mat-sys-body-large-weight));
}
.mat-mdc-option:hover:not(.mdc-list-item--disabled) {
  background-color: var(--mat-option-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-option:focus.mdc-list-item, .mat-mdc-option.mat-mdc-option-active.mdc-list-item {
  background-color: var(--mat-option-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));
  outline: 0;
}
.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) {
  background-color: var(--mat-option-selected-state-layer-color, var(--mat-sys-secondary-container));
}
.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) .mdc-list-item__primary-text {
  color: var(--mat-option-selected-state-label-text-color, var(--mat-sys-on-secondary-container));
}
.mat-mdc-option .mat-pseudo-checkbox {
  --mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--mat-option-selected-state-label-text-color, var(--mat-sys-on-secondary-container));
}
.mat-mdc-option.mdc-list-item {
  align-items: center;
  background: transparent;
}
.mat-mdc-option.mdc-list-item--disabled {
  cursor: default;
  pointer-events: none;
}
.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox, .mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text, .mat-mdc-option.mdc-list-item--disabled > mat-icon {
  opacity: 0.38;
}
.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 32px;
}
[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 16px;
  padding-right: 32px;
}
.mat-mdc-option .mat-icon,
.mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-icon,
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 0;
  margin-left: 16px;
}
.mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-left: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-right: 16px;
  margin-left: 0;
}
.mat-mdc-option .mat-mdc-option-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
.mat-mdc-option .mdc-list-item__primary-text {
  white-space: normal;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  font-family: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  margin-right: auto;
}
[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text {
  margin-right: 0;
  margin-left: auto;
}
@media (forced-colors: active) {
  .mat-mdc-option.mdc-list-item--selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    width: 10px;
    height: 0;
    border-bottom: solid 10px;
    border-radius: 10px;
  }
  [dir=rtl] .mat-mdc-option.mdc-list-item--selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    right: auto;
    left: 16px;
  }
}

.mat-mdc-option-multiple {
  --mat-list-list-item-selected-container-color: var(--mat-list-list-item-container-color, transparent);
}

.mat-mdc-option-active .mat-focus-indicator::before {
  content: "";
}
`],encapsulation:2,changeDetection:0})}return n})();function Lt(n,a,e){if(e.length){let t=a.toArray(),i=e.toArray(),o=0;for(let m=0;m<n+1;m++)t[m].group&&t[m].group===i[o]&&o++;return o}return 0}function Bt(n,a,e,t){return n<e?n:n+a>e+t?Math.max(0,n-t+a):e}var zt=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275mod=A({type:n});static \u0275inj=P({imports:[z]})}return n})();var Oe=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275mod=A({type:n});static \u0275inj=P({imports:[ht,zt,W,z]})}return n})();var ni=["trigger"],ai=["panel"],oi=[[["mat-select-trigger"]],"*"],ri=["mat-select-trigger","*"];function si(n,a){if(n&1&&(s(0,"span",4),c(1),r()),n&2){let e=p();l(),v(e.placeholder)}}function li(n,a){n&1&&N(0)}function ci(n,a){if(n&1&&(s(0,"span",11),c(1),r()),n&2){let e=p(2);l(),v(e.triggerValue)}}function di(n,a){if(n&1&&(s(0,"span",5),g(1,li,1,0)(2,ci,2,1,"span",11),r()),n&2){let e=p();l(),_(e.customTrigger?1:2)}}function mi(n,a){if(n&1){let e=V();s(0,"div",12,1),u("keydown",function(i){I(e);let o=p();return D(o._handleKeydown(i))}),N(2,1),r()}if(n&2){let e=p();We(e.panelClass),M("mat-select-panel-animations-enabled",!e._animationsDisabled)("mat-primary",(e._parentFormField==null?null:e._parentFormField.color)==="primary")("mat-accent",(e._parentFormField==null?null:e._parentFormField.color)==="accent")("mat-warn",(e._parentFormField==null?null:e._parentFormField.color)==="warn")("mat-undefined",!(e._parentFormField!=null&&e._parentFormField.color)),w("id",e.id+"-panel")("aria-multiselectable",e.multiple)("aria-label",e.ariaLabel||null)("aria-labelledby",e._getPanelAriaLabelledby())}}var pi=new E("mat-select-scroll-strategy",{providedIn:"root",factory:()=>{let n=d(Te);return()=>wt(n)}}),hi=new E("MAT_SELECT_CONFIG"),ui=new E("MatSelectTrigger"),Ee=class{source;value;constructor(a,e){this.source=a,this.value=e}},jt=(()=>{class n{_viewportRuler=d(Mt);_changeDetectorRef=d(Z);_elementRef=d(Y);_dir=d(pt,{optional:!0});_idGenerator=d(te);_renderer=d(Ae);_parentFormField=d(_t,{optional:!0});ngControl=d(Ue,{self:!0,optional:!0});_liveAnnouncer=d(rt);_defaultOptions=d(hi,{optional:!0});_animationsDisabled=ie();_popoverLocation;_initialized=new S;_cleanupDetach;options;optionGroups;customTrigger;_positions=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"},{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom",panelClass:"mat-mdc-select-panel-above"},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom",panelClass:"mat-mdc-select-panel-above"}];_scrollOptionIntoView(e){let t=this.options.toArray()[e];if(t){let i=this.panel.nativeElement,o=Lt(e,this.options,this.optionGroups),m=t._getHostElement();e===0&&o===1?i.scrollTop=0:i.scrollTop=Bt(m.offsetTop,m.offsetHeight,i.scrollTop,i.offsetHeight)}}_positioningSettled(){this._scrollOptionIntoView(this._keyManager.activeItemIndex||0)}_getChangeEvent(e){return new Ee(this,e)}_scrollStrategyFactory=d(pi);_panelOpen=!1;_compareWith=(e,t)=>e===t;_uid=this._idGenerator.getId("mat-select-");_triggerAriaLabelledBy=null;_previousControl;_destroy=new S;_errorStateTracker;stateChanges=new S;disableAutomaticLabeling=!0;userAriaDescribedBy;_selectionModel;_keyManager;_preferredOverlayOrigin;_overlayWidth;_onChange=()=>{};_onTouched=()=>{};_valueId=this._idGenerator.getId("mat-select-value-");_scrollStrategy;_overlayPanelClass=this._defaultOptions?.overlayPanelClass||"";get focused(){return this._focused||this._panelOpen}_focused=!1;controlType="mat-select";trigger;panel;_overlayDir;panelClass;disabled=!1;get disableRipple(){return this._disableRipple()}set disableRipple(e){this._disableRipple.set(e)}_disableRipple=Q(!1);tabIndex=0;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(e){this._hideSingleSelectionIndicator=e,this._syncParentProperties()}_hideSingleSelectionIndicator=this._defaultOptions?.hideSingleSelectionIndicator??!1;get placeholder(){return this._placeholder}set placeholder(e){this._placeholder=e,this.stateChanges.next()}_placeholder;get required(){return this._required??this.ngControl?.control?.hasValidator(Ye.required)??!1}set required(e){this._required=e,this.stateChanges.next()}_required;get multiple(){return this._multiple}set multiple(e){this._selectionModel,this._multiple=e}_multiple=!1;disableOptionCentering=this._defaultOptions?.disableOptionCentering??!1;get compareWith(){return this._compareWith}set compareWith(e){this._compareWith=e,this._selectionModel&&this._initializeSelection()}get value(){return this._value}set value(e){this._assignValue(e)&&this._onChange(e)}_value;ariaLabel="";ariaLabelledby;get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e}typeaheadDebounceInterval;sortComparator;get id(){return this._id}set id(e){this._id=e||this._uid,this.stateChanges.next()}_id;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e}panelWidth=this._defaultOptions&&typeof this._defaultOptions.panelWidth<"u"?this._defaultOptions.panelWidth:"auto";canSelectNullableOptions=this._defaultOptions?.canSelectNullableOptions??!1;optionSelectionChanges=Ie(()=>{let e=this.options;return e?e.changes.pipe(ue(e),fe(()=>G(...e.map(t=>t.onSelectionChange)))):this._initialized.pipe(fe(()=>this.optionSelectionChanges))});openedChange=new F;_openedStream=this.openedChange.pipe(he(e=>e),pe(()=>{}));_closedStream=this.openedChange.pipe(he(e=>!e),pe(()=>{}));selectionChange=new F;valueChange=new F;constructor(){let e=d(vt),t=d(Je,{optional:!0}),i=d(ee,{optional:!0}),o=d(new je("tabindex"),{optional:!0}),m=d(Ot,{optional:!0});this.ngControl&&(this.ngControl.valueAccessor=this),this._defaultOptions?.typeaheadDebounceInterval!=null&&(this.typeaheadDebounceInterval=this._defaultOptions.typeaheadDebounceInterval),this._errorStateTracker=new yt(e,this.ngControl,i,t,this.stateChanges),this._scrollStrategy=this._scrollStrategyFactory(),this.tabIndex=o==null?0:parseInt(o)||0,this._popoverLocation=m?.usePopover===!1?null:"inline",this.id=this.id}ngOnInit(){this._selectionModel=new q(this.multiple),this.stateChanges.next(),this._viewportRuler.change().pipe(T(this._destroy)).subscribe(()=>{this.panelOpen&&(this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._changeDetectorRef.detectChanges())})}ngAfterContentInit(){this._initialized.next(),this._initialized.complete(),this._initKeyManager(),this._selectionModel.changed.pipe(T(this._destroy)).subscribe(e=>{e.added.forEach(t=>t.select()),e.removed.forEach(t=>t.deselect())}),this.options.changes.pipe(ue(null),T(this._destroy)).subscribe(()=>{this._resetOptions(),this._initializeSelection()})}ngDoCheck(){let e=this._getTriggerAriaLabelledby(),t=this.ngControl;if(e!==this._triggerAriaLabelledBy){let i=this._elementRef.nativeElement;this._triggerAriaLabelledBy=e,e?i.setAttribute("aria-labelledby",e):i.removeAttribute("aria-labelledby")}t&&(this._previousControl!==t.control&&(this._previousControl!==void 0&&t.disabled!==null&&t.disabled!==this.disabled&&(this.disabled=t.disabled),this._previousControl=t.control),this.updateErrorState())}ngOnChanges(e){(e.disabled||e.userAriaDescribedBy)&&this.stateChanges.next(),e.typeaheadDebounceInterval&&this._keyManager&&this._keyManager.withTypeAhead(this.typeaheadDebounceInterval),e.panelClass&&this.panelClass instanceof Set&&(this.panelClass=Array.from(this.panelClass))}ngOnDestroy(){this._cleanupDetach?.(),this._keyManager?.destroy(),this._destroy.next(),this._destroy.complete(),this.stateChanges.complete(),this._clearFromModal()}toggle(){this.panelOpen?this.close():this.open()}open(){this._canOpen()&&(this._parentFormField&&(this._preferredOverlayOrigin=this._parentFormField.getConnectedOverlayOrigin()),this._cleanupDetach?.(),this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._applyModalPanelOwnership(),this._panelOpen=!0,this._overlayDir.positionChange.pipe(De(1)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this._positioningSettled()}),this._overlayDir.attachOverlay(),this._keyManager.withHorizontalOrientation(null),this._highlightCorrectOption(),this._changeDetectorRef.markForCheck(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(!0)))}_trackedModal=null;_applyModalPanelOwnership(){let e=this._elementRef.nativeElement.closest('body > .cdk-overlay-container [aria-modal="true"]');if(!e)return;let t=`${this.id}-panel`;this._trackedModal&&xe(this._trackedModal,"aria-owns",t),lt(e,"aria-owns",t),this._trackedModal=e}_clearFromModal(){if(!this._trackedModal)return;let e=`${this.id}-panel`;xe(this._trackedModal,"aria-owns",e),this._trackedModal=null}close(){this._panelOpen&&(this._panelOpen=!1,this._exitAndDetach(),this._keyManager.withHorizontalOrientation(this._isRtl()?"rtl":"ltr"),this._changeDetectorRef.markForCheck(),this._onTouched(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(!1)))}_exitAndDetach(){if(this._animationsDisabled||!this.panel){this._detachOverlay();return}this._cleanupDetach?.(),this._cleanupDetach=()=>{t(),clearTimeout(i),this._cleanupDetach=void 0};let e=this.panel.nativeElement,t=this._renderer.listen(e,"animationend",o=>{o.animationName==="_mat-select-exit"&&(this._cleanupDetach?.(),this._detachOverlay())}),i=setTimeout(()=>{this._cleanupDetach?.(),this._detachOverlay()},200);e.classList.add("mat-select-panel-exit")}_detachOverlay(){this._overlayDir.detachOverlay(),this._changeDetectorRef.markForCheck()}writeValue(e){this._assignValue(e)}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck(),this.stateChanges.next()}get panelOpen(){return this._panelOpen}get selected(){return this.multiple?this._selectionModel?.selected||[]:this._selectionModel?.selected[0]}get triggerValue(){if(this.empty)return"";if(this._multiple){let e=this._selectionModel.selected.map(t=>t.viewValue);return this._isRtl()&&e.reverse(),e.join(", ")}return this._selectionModel.selected[0].viewValue}updateErrorState(){this._errorStateTracker.updateErrorState()}_isRtl(){return this._dir?this._dir.value==="rtl":!1}_handleKeydown(e){this.disabled||(this.panelOpen?this._handleOpenKeydown(e):this._handleClosedKeydown(e))}_handleClosedKeydown(e){let t=e.keyCode,i=t===40||t===38||t===37||t===39,o=t===13||t===32,m=this._keyManager;if(!m.isTyping()&&o&&!B(e)||(this.multiple||e.altKey)&&i)e.preventDefault(),this.open();else if(!this.multiple){let K=this.selected;m.onKeydown(e);let y=this.selected;y&&K!==y&&this._liveAnnouncer.announce(y.viewValue,1e4)}}_handleOpenKeydown(e){let t=this._keyManager,i=e.keyCode,o=i===40||i===38,m=t.isTyping();if(o&&e.altKey)e.preventDefault(),this.close();else if(!m&&(i===13||i===32)&&t.activeItem&&!B(e))e.preventDefault(),t.activeItem._selectViaInteraction();else if(!m&&this._multiple&&i===65&&e.ctrlKey){e.preventDefault();let K=this.options.some(y=>!y.disabled&&!y.selected);this.options.forEach(y=>{y.disabled||(K?y.select():y.deselect())})}else{let K=t.activeItemIndex;t.onKeydown(e),this._multiple&&o&&e.shiftKey&&t.activeItem&&t.activeItemIndex!==K&&t.activeItem._selectViaInteraction()}}_handleOverlayKeydown(e){e.keyCode===27&&!B(e)&&(e.preventDefault(),this.close())}_onFocus(){this.disabled||(this._focused=!0,this.stateChanges.next())}_onBlur(){this._focused=!1,this._keyManager?.cancelTypeahead(),!this.disabled&&!this.panelOpen&&(this._onTouched(),this._changeDetectorRef.markForCheck(),this.stateChanges.next())}get empty(){return!this._selectionModel||this._selectionModel.isEmpty()}_initializeSelection(){Promise.resolve().then(()=>{this.ngControl&&(this._value=this.ngControl.value),this._setSelectionByValue(this._value),this.stateChanges.next()})}_setSelectionByValue(e){if(this.options.forEach(t=>t.setInactiveStyles()),this._selectionModel.clear(),this.multiple&&e)Array.isArray(e),e.forEach(t=>this._selectOptionByValue(t)),this._sortValues();else{let t=this._selectOptionByValue(e);t?this._keyManager.updateActiveItem(t):this.panelOpen||this._keyManager.updateActiveItem(-1)}this._changeDetectorRef.markForCheck()}_selectOptionByValue(e){let t=this.options.find(i=>{if(this._selectionModel.isSelected(i))return!1;try{return(i.value!=null||this.canSelectNullableOptions)&&this._compareWith(i.value,e)}catch{return!1}});return t&&this._selectionModel.select(t),t}_assignValue(e){return e!==this._value||this._multiple&&Array.isArray(e)?(this.options&&this._setSelectionByValue(e),this._value=e,!0):!1}_skipPredicate=e=>this.panelOpen?!1:e.disabled;_getOverlayWidth(e){return this.panelWidth==="auto"?(e instanceof Ce?e.elementRef:e||this._elementRef).nativeElement.getBoundingClientRect().width:this.panelWidth===null?"":this.panelWidth}_syncParentProperties(){if(this.options)for(let e of this.options)e._changeDetectorRef.markForCheck()}_initKeyManager(){this._keyManager=new st(this.options).withTypeAhead(this.typeaheadDebounceInterval).withVerticalOrientation().withHorizontalOrientation(this._isRtl()?"rtl":"ltr").withHomeAndEnd().withPageUpDown().withAllowedModifierKeys(["shiftKey"]).skipPredicate(this._skipPredicate),this._keyManager.tabOut.subscribe(()=>{this.panelOpen&&(!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction(),this.focus(),this.close())}),this._keyManager.change.subscribe(()=>{this._panelOpen&&this.panel?this._scrollOptionIntoView(this._keyManager.activeItemIndex||0):!this._panelOpen&&!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction()})}_resetOptions(){let e=G(this.options.changes,this._destroy);this.optionSelectionChanges.pipe(T(e)).subscribe(t=>{this._onSelect(t.source,t.isUserInput),t.isUserInput&&!this.multiple&&this._panelOpen&&(this.close(),this.focus())}),G(...this.options.map(t=>t._stateChanges)).pipe(T(e)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this.stateChanges.next()})}_onSelect(e,t){let i=this._selectionModel.isSelected(e);!this.canSelectNullableOptions&&e.value==null&&!this._multiple?(e.deselect(),this._selectionModel.clear(),this.value!=null&&this._propagateChanges(e.value)):(i!==e.selected&&(e.selected?this._selectionModel.select(e):this._selectionModel.deselect(e)),t&&this._keyManager.setActiveItem(e),this.multiple&&(this._sortValues(),t&&this.focus())),i!==this._selectionModel.isSelected(e)&&this._propagateChanges(),this.stateChanges.next()}_sortValues(){if(this.multiple){let e=this.options.toArray();this._selectionModel.sort((t,i)=>this.sortComparator?this.sortComparator(t,i,e):e.indexOf(t)-e.indexOf(i)),this.stateChanges.next()}}_propagateChanges(e){let t;this.multiple?t=this.selected.map(i=>i.value):t=this.selected?this.selected.value:e,this._value=t,this.valueChange.emit(t),this._onChange(t),this.selectionChange.emit(this._getChangeEvent(t)),this._changeDetectorRef.markForCheck()}_highlightCorrectOption(){if(this._keyManager)if(this.empty){let e=-1;for(let t=0;t<this.options.length;t++)if(!this.options.get(t).disabled){e=t;break}this._keyManager.setActiveItem(e)}else this._keyManager.setActiveItem(this._selectionModel.selected[0])}_canOpen(){return!this._panelOpen&&!this.disabled&&this.options?.length>0&&!!this._overlayDir}focus(e){this._elementRef.nativeElement.focus(e)}_getPanelAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||null,t=e?e+" ":"";return this.ariaLabelledby?t+this.ariaLabelledby:e}_getAriaActiveDescendant(){return this.panelOpen&&this._keyManager&&this._keyManager.activeItem?this._keyManager.activeItem.id:null}_getTriggerAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||"";return this.ariaLabelledby&&(e+=" "+this.ariaLabelledby),e||(e=this._valueId),e}get describedByIds(){return this._elementRef.nativeElement.getAttribute("aria-describedby")?.split(" ")||[]}setDescribedByIds(e){let t=this._elementRef.nativeElement;e.length?t.setAttribute("aria-describedby",e.join(" ")):t.removeAttribute("aria-describedby")}onContainerClick(e){let t=nt(e);t&&(t.tagName==="MAT-OPTION"||t.classList.contains("cdk-overlay-backdrop")||t.closest(".mat-mdc-select-panel"))||(this.focus(),this.open())}get shouldLabelFloat(){return this.panelOpen||!this.empty||this.focused&&!!this.placeholder}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=f({type:n,selectors:[["mat-select"]],contentQueries:function(t,i,o){if(t&1&&Be(o,ui,5)(o,W,5)(o,we,5),t&2){let m;C(m=k())&&(i.customTrigger=m.first),C(m=k())&&(i.options=m),C(m=k())&&(i.optionGroups=m)}},viewQuery:function(t,i){if(t&1&&J(ni,5)(ai,5)(ke,5),t&2){let o;C(o=k())&&(i.trigger=o.first),C(o=k())&&(i.panel=o.first),C(o=k())&&(i._overlayDir=o.first)}},hostAttrs:["role","combobox","aria-haspopup","listbox",1,"mat-mdc-select"],hostVars:21,hostBindings:function(t,i){t&1&&u("keydown",function(m){return i._handleKeydown(m)})("focus",function(){return i._onFocus()})("blur",function(){return i._onBlur()}),t&2&&(w("id",i.id)("tabindex",i.disabled?-1:i.tabIndex)("aria-controls",i.panelOpen?i.id+"-panel":null)("aria-expanded",i.panelOpen)("aria-label",i.ariaLabel||null)("aria-required",i.required.toString())("aria-disabled",i.disabled.toString())("aria-invalid",i.errorState)("aria-activedescendant",i._getAriaActiveDescendant()),M("mat-mdc-select-disabled",i.disabled)("mat-mdc-select-invalid",i.errorState)("mat-mdc-select-required",i.required)("mat-mdc-select-empty",i.empty)("mat-mdc-select-multiple",i.multiple)("mat-select-open",i.panelOpen))},inputs:{userAriaDescribedBy:[0,"aria-describedby","userAriaDescribedBy"],panelClass:"panelClass",disabled:[2,"disabled","disabled",x],disableRipple:[2,"disableRipple","disableRipple",x],tabIndex:[2,"tabIndex","tabIndex",e=>e==null?0:ye(e)],hideSingleSelectionIndicator:[2,"hideSingleSelectionIndicator","hideSingleSelectionIndicator",x],placeholder:"placeholder",required:[2,"required","required",x],multiple:[2,"multiple","multiple",x],disableOptionCentering:[2,"disableOptionCentering","disableOptionCentering",x],compareWith:"compareWith",value:"value",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],errorStateMatcher:"errorStateMatcher",typeaheadDebounceInterval:[2,"typeaheadDebounceInterval","typeaheadDebounceInterval",ye],sortComparator:"sortComparator",id:"id",panelWidth:"panelWidth",canSelectNullableOptions:[2,"canSelectNullableOptions","canSelectNullableOptions",x]},outputs:{openedChange:"openedChange",_openedStream:"opened",_closedStream:"closed",selectionChange:"selectionChange",valueChange:"valueChange"},exportAs:["matSelect"],features:[be([{provide:gt,useExisting:n},{provide:Se,useExisting:n}]),Pe],ngContentSelectors:ri,decls:11,vars:10,consts:[["fallbackOverlayOrigin","cdkOverlayOrigin","trigger",""],["panel",""],["cdk-overlay-origin","",1,"mat-mdc-select-trigger",3,"click"],[1,"mat-mdc-select-value"],[1,"mat-mdc-select-placeholder","mat-mdc-select-min-line"],[1,"mat-mdc-select-value-text"],[1,"mat-mdc-select-arrow-wrapper"],[1,"mat-mdc-select-arrow"],["viewBox","0 0 24 24","width","24px","height","24px","focusable","false","aria-hidden","true"],["d","M7 10l5 5 5-5z"],["cdk-connected-overlay","","cdkConnectedOverlayHasBackdrop","","cdkConnectedOverlayBackdropClass","cdk-overlay-transparent-backdrop",3,"detach","backdropClick","overlayKeydown","cdkConnectedOverlayDisableClose","cdkConnectedOverlayPanelClass","cdkConnectedOverlayScrollStrategy","cdkConnectedOverlayOrigin","cdkConnectedOverlayPositions","cdkConnectedOverlayWidth","cdkConnectedOverlayFlexibleDimensions","cdkConnectedOverlayUsePopover"],[1,"mat-mdc-select-min-line"],["role","listbox","tabindex","-1",1,"mat-mdc-select-panel","mdc-menu-surface","mdc-menu-surface--open",3,"keydown"]],template:function(t,i){if(t&1&&(X(oi),s(0,"div",2,0),u("click",function(){return i.open()}),s(3,"div",3),g(4,si,2,1,"span",4)(5,di,3,1,"span",5),r(),s(6,"div",6)(7,"div",7),Re(),s(8,"svg",8),b(9,"path",9),r()()()(),Ve(10,mi,3,16,"ng-template",10),u("detach",function(){return i.close()})("backdropClick",function(){return i.close()})("overlayKeydown",function(m){return i._handleOverlayKeydown(m)})),t&2){let o=ze(1);l(3),w("id",i._valueId),l(),_(i.empty?4:5),l(6),h("cdkConnectedOverlayDisableClose",!0)("cdkConnectedOverlayPanelClass",i._overlayPanelClass)("cdkConnectedOverlayScrollStrategy",i._scrollStrategy)("cdkConnectedOverlayOrigin",i._preferredOverlayOrigin||o)("cdkConnectedOverlayPositions",i._positions)("cdkConnectedOverlayWidth",i._overlayWidth)("cdkConnectedOverlayFlexibleDimensions",!0)("cdkConnectedOverlayUsePopover",i._popoverLocation)}},dependencies:[Ce,ke],styles:[`@keyframes _mat-select-enter {
  from {
    opacity: 0;
    transform: scaleY(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes _mat-select-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-select {
  display: inline-block;
  width: 100%;
  outline: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  color: var(--mat-select-enabled-trigger-text-color, var(--mat-sys-on-surface));
  font-family: var(--mat-select-trigger-text-font, var(--mat-sys-body-large-font));
  line-height: var(--mat-select-trigger-text-line-height, var(--mat-sys-body-large-line-height));
  font-size: var(--mat-select-trigger-text-size, var(--mat-sys-body-large-size));
  font-weight: var(--mat-select-trigger-text-weight, var(--mat-sys-body-large-weight));
  letter-spacing: var(--mat-select-trigger-text-tracking, var(--mat-sys-body-large-tracking));
}

div.mat-mdc-select-panel {
  box-shadow: var(--mat-select-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
}

.mat-mdc-select-disabled {
  color: var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-select-disabled .mat-mdc-select-placeholder {
  color: var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-select-trigger {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  width: 100%;
}
.mat-mdc-select-disabled .mat-mdc-select-trigger {
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
}

.mat-mdc-select-value {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mat-mdc-select-value-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mat-mdc-select-arrow-wrapper {
  height: 24px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}
.mat-form-field-appearance-fill .mdc-text-field--no-label .mat-mdc-select-arrow-wrapper {
  transform: none;
}

.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-invalid .mat-mdc-select-arrow,
.mat-form-field-invalid:not(.mat-form-field-disabled) .mat-mdc-form-field-infix::after {
  color: var(--mat-select-invalid-arrow-color, var(--mat-sys-error));
}

.mat-mdc-select-arrow {
  width: 10px;
  height: 5px;
  position: relative;
  color: var(--mat-select-enabled-arrow-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-form-field.mat-focused .mat-mdc-select-arrow {
  color: var(--mat-select-focused-arrow-color, var(--mat-sys-primary));
}
.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-disabled .mat-mdc-select-arrow {
  color: var(--mat-select-disabled-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-select-open .mat-mdc-select-arrow {
  transform: rotate(180deg);
}
.mat-form-field-animations-enabled .mat-mdc-select-arrow {
  transition: transform 80ms linear;
}
.mat-mdc-select-arrow svg {
  fill: currentColor;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
@media (forced-colors: active) {
  .mat-mdc-select-arrow svg {
    fill: CanvasText;
  }
  .mat-mdc-select-disabled .mat-mdc-select-arrow svg {
    fill: GrayText;
  }
}

div.mat-mdc-select-panel {
  width: 100%;
  max-height: 275px;
  outline: 0;
  overflow: auto;
  padding: 8px 0;
  box-sizing: border-box;
  transform-origin: top center;
  border-radius: 0 0 4px 4px;
  position: relative;
  background-color: var(--mat-select-panel-background-color, var(--mat-sys-surface-container));
}
.mat-mdc-select-panel-above div.mat-mdc-select-panel {
  border-radius: 4px 4px 0 0;
  transform-origin: bottom center;
}
@media (forced-colors: active) {
  div.mat-mdc-select-panel {
    outline: solid 1px;
  }
}

.mat-select-panel-animations-enabled {
  animation: _mat-select-enter 120ms cubic-bezier(0, 0, 0.2, 1);
}
.mat-select-panel-animations-enabled.mat-select-panel-exit {
  animation: _mat-select-exit 100ms linear;
}

.mat-mdc-select-placeholder {
  transition: color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);
  color: var(--mat-select-placeholder-text-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-form-field:not(.mat-form-field-animations-enabled) .mat-mdc-select-placeholder, ._mat-animation-noopable .mat-mdc-select-placeholder {
  transition: none;
}
.mat-form-field-hide-placeholder .mat-mdc-select-placeholder {
  color: transparent;
  -webkit-text-fill-color: transparent;
  transition: none;
  display: block;
}

.mat-mdc-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper {
  cursor: pointer;
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mat-mdc-floating-label {
  max-width: calc(100% - 18px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mdc-floating-label--float-above {
  max-width: calc(100% / 0.75 - 24px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-notched-outline__notch {
  max-width: calc(100% - 60px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-text-field--label-floating .mdc-notched-outline__notch {
  max-width: calc(100% - 24px);
}

.mat-mdc-select-min-line:empty::before {
  content: " ";
  white-space: pre;
  width: 1px;
  display: inline-block;
  visibility: hidden;
}

.mat-form-field-appearance-fill .mat-mdc-select-arrow-wrapper {
  transform: var(--mat-select-arrow-transform, translateY(-8px));
}
`],encapsulation:2,changeDetection:0})}return n})();var Ht=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275mod=A({type:n});static \u0275inj=P({imports:[Et,Oe,z,St,se,Oe]})}return n})();var bi=n=>["/recipes",n];function vi(n,a){if(n&1&&(s(0,"span",3),c(1),r()),n&2){let e=p();l(),O("",e.recipe().matchPercent,"% match")}}function yi(n,a){if(n&1){let e=V();s(0,"button",13),u("click",function(){I(e);let i=p();return D(i.shareClick.emit(i.recipe()))}),s(1,"mat-icon"),c(2,"share"),r()()}}var de=class n{recipe=L.required();isFavorite=L(!1);canFavorite=L(!0);showMatch=L(!0);showShare=L(!0);favoriteClick=ve();shareClick=ve();get meta(){return At(this.recipe().id)}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=f({type:n,selectors:[["app-recipe-card"]],inputs:{recipe:[1,"recipe"],isFavorite:[1,"isFavorite"],canFavorite:[1,"canFavorite"],showMatch:[1,"showMatch"],showShare:[1,"showShare"]},outputs:{favoriteClick:"favoriteClick",shareClick:"shareClick"},decls:35,vars:18,consts:[[1,"recipe-card"],[1,"img-wrap"],["loading","lazy","onerror","this.onerror=null;this.parentElement.classList.add('img-fallback')",3,"src","alt"],[1,"match-badge"],[1,"img-overlay"],["mat-icon-button","","type","button",1,"overlay-btn",3,"click","disabled"],[1,"card-top"],[1,"cuisine-tag"],[1,"rating"],[1,"meta-row"],[1,"card-actions"],["mat-flat-button","","color","primary",3,"routerLink"],["mat-icon-button","","type","button","aria-label","Share recipe"],["mat-icon-button","","type","button","aria-label","Share recipe",3,"click"]],template:function(e,t){e&1&&(s(0,"mat-card",0)(1,"div",1),b(2,"img",2),g(3,vi,2,1,"span",3),s(4,"div",4)(5,"button",5),u("click",function(o){return t.favoriteClick.emit(t.recipe()),o.stopPropagation()}),s(6,"mat-icon"),c(7),r()()()(),s(8,"mat-card-content")(9,"div",6)(10,"span",7),c(11),r(),s(12,"span",8)(13,"mat-icon"),c(14,"star"),r(),c(15),r()(),s(16,"h3"),c(17),r(),s(18,"div",9)(19,"span")(20,"mat-icon"),c(21,"schedule"),r(),c(22),r(),s(23,"span")(24,"mat-icon"),c(25,"bar_chart"),r(),c(26),r(),s(27,"span")(28,"mat-icon"),c(29,"local_fire_department"),r(),c(30),r()()(),s(31,"mat-card-actions",10)(32,"a",11),c(33,"View Recipe"),r(),g(34,yi,3,0,"button",12),r()()),e&2&&(l(2),h("src",t.recipe().image,Fe)("alt",t.recipe().name),l(),_(t.showMatch()?3:-1),l(2),M("is-favorite",t.isFavorite()),h("disabled",!t.canFavorite()),w("aria-label",t.isFavorite()?"Remove from favorites":"Add to favorites"),l(2),v(t.isFavorite()?"favorite":"favorite_border"),l(4),v(t.recipe().cuisine),l(4),v(t.meta.rating),l(2),v(t.recipe().name),l(5),O("",t.meta.cookingTime," min"),l(4),v(t.meta.difficulty),l(4),O("",t.meta.calories," kcal"),l(2),h("routerLink",Ke(16,bi,t.recipe().id)),l(2),_(t.showShare()?34:-1))},dependencies:[qe,ae,ne,mt,Ft,Rt,Pt,Tt,re,oe],styles:[".recipe-card[_ngcontent-%COMP%]{border:1px solid var(--border);border-radius:var(--radius-lg)!important;box-shadow:var(--shadow-sm);display:flex;flex-direction:column;overflow:hidden;transition:transform .28s ease,box-shadow .28s ease}.recipe-card[_ngcontent-%COMP%]:hover{box-shadow:var(--shadow);transform:translateY(-6px)}.img-wrap[_ngcontent-%COMP%]{aspect-ratio:4/3;background:linear-gradient(135deg,#ffe4d1,#ffd0e0);overflow:hidden;position:relative}.img-wrap[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:100%;object-fit:cover;transition:transform .4s ease;width:100%}.recipe-card[_ngcontent-%COMP%]:hover   .img-wrap[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{transform:scale(1.08)}.img-wrap.img-fallback[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{display:none}.match-badge[_ngcontent-%COMP%]{background:#000000a6;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);border-radius:999px;color:#fff;font-size:.72rem;font-weight:700;padding:5px 11px;position:absolute;right:10px;top:10px}.img-overlay[_ngcontent-%COMP%]{align-items:center;background:linear-gradient(to top,rgba(0,0,0,.45),transparent);bottom:0;display:flex;gap:4px;justify-content:flex-end;left:0;opacity:0;padding:10px;position:absolute;right:0;transition:opacity .25s ease}.recipe-card[_ngcontent-%COMP%]:hover   .img-overlay[_ngcontent-%COMP%]{opacity:1}.overlay-btn[_ngcontent-%COMP%]{background:#ffffffeb!important;color:var(--text)!important}.overlay-btn.is-favorite[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:#e53935}mat-card-content[_ngcontent-%COMP%]{display:grid;gap:8px;padding:16px 18px 8px!important}.card-top[_ngcontent-%COMP%]{align-items:center;display:flex;justify-content:space-between}.cuisine-tag[_ngcontent-%COMP%]{background:#fff1eb;border-radius:999px;color:var(--primary);font-size:.75rem;font-weight:700;padding:4px 10px}.rating[_ngcontent-%COMP%]{align-items:center;color:#f59e0b;display:inline-flex;font-size:.88rem;font-weight:700;gap:2px}.rating[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:16px;height:16px;width:16px}h3[_ngcontent-%COMP%]{font-size:1.02rem;line-height:1.35;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.meta-row[_ngcontent-%COMP%]{color:var(--muted);display:flex;flex-wrap:wrap;font-size:.78rem;gap:10px}.meta-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{align-items:center;display:inline-flex;gap:3px}.meta-row[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:14px;height:14px;width:14px}.card-actions[_ngcontent-%COMP%]{align-items:center;display:flex;gap:4px;padding:4px 12px 14px!important}.card-actions[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{border-radius:999px!important;flex:1}"]})};var me=class n{static \u0275fac=function(e){return new(e||n)};static \u0275cmp=f({type:n,selectors:[["app-recipe-card-skeleton"]],decls:6,vars:0,consts:[[1,"skeleton-card"],[1,"skeleton","shimmer","img-skeleton"],[1,"skeleton-body"],[1,"skeleton","shimmer","line","w-30"],[1,"skeleton","shimmer","line","w-80"],[1,"skeleton","shimmer","line","w-60"]],template:function(e,t){e&1&&($(0,"div",0),_e(1,"div",1),$(2,"div",2),_e(3,"div",3)(4,"div",4)(5,"div",5),ge()())},styles:['.skeleton-card[_ngcontent-%COMP%]{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden}.skeleton-body[_ngcontent-%COMP%]{display:grid;gap:10px;padding:16px}.skeleton[_ngcontent-%COMP%]{background:#eee;border-radius:6px}.img-skeleton[_ngcontent-%COMP%]{aspect-ratio:4/3;border-radius:0}.line[_ngcontent-%COMP%]{height:14px}.w-30[_ngcontent-%COMP%]{width:30%}.w-60[_ngcontent-%COMP%]{width:60%}.w-80[_ngcontent-%COMP%]{width:80%}.shimmer[_ngcontent-%COMP%]{overflow:hidden;position:relative}.shimmer[_ngcontent-%COMP%]:after{animation:_ngcontent-%COMP%_shimmer 1.3s infinite;background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);content:"";inset:0;position:absolute;transform:translate(-100%)}@keyframes _ngcontent-%COMP%_shimmer{to{transform:translate(100%)}}']})};var xi=(n,a)=>a.id;function Ci(n,a){if(n&1&&(s(0,"mat-option",13),c(1),r()),n&2){let e=a.$implicit;h("value",e),l(),v(e)}}function ki(n,a){if(n&1&&(s(0,"mat-option",13),c(1),r()),n&2){let e=a.$implicit;h("value",e),l(),v(e)}}function Mi(n,a){n&1&&b(0,"app-recipe-card-skeleton")}function Si(n,a){if(n&1&&(s(0,"div",16),j(1,Mi,1,0,"app-recipe-card-skeleton",null,U),r()),n&2){let e=p();l(),H(e.skeletonRows)}}function wi(n,a){n&1&&b(0,"app-empty-state",17)}function Oi(n,a){if(n&1){let e=V();s(0,"app-recipe-card",20),u("favoriteClick",function(i){I(e);let o=p(2);return D(o.toggleFavorite(i))})("shareClick",function(i){I(e);let o=p(2);return D(o.share(i))}),r()}if(n&2){let e=a.$implicit,t=p(2);h("recipe",e)("isFavorite",t.fav.favoriteIds().has(e.id))("canFavorite",t.auth.isLoggedIn())}}function Ei(n,a){if(n&1&&(s(0,"p",18),c(1),r(),s(2,"div",16),j(3,Oi,1,3,"app-recipe-card",19,xi),r()),n&2){let e=p();l(),O("",e.store.recipes().length," recipes found"),l(2),H(e.store.recipes())}}var Gt=class n{fb=d(tt);route=d(He);store=d(kt);fav=d(Dt);auth=d(Ge);snack=d(It);lastSavedHistoryKey="";form=this.fb.nonNullable.group({query:["tomato,onion"],mode:["ingredients"],cuisine:[""],category:[""]});skeletonRows=Array.from({length:6},(a,e)=>e);ngOnInit(){this.store.loadFilters(),this.auth.isLoggedIn()&&this.fav.load().subscribe(),this.route.queryParamMap.subscribe(a=>{this.form.patchValue({query:a.get("q")||this.form.value.query||"",cuisine:a.get("cuisine")||"",category:a.get("category")||""}),a.keys.length&&this.search()})}search(){let a=this.form.getRawValue(),e=[a.query,a.category,a.cuisine].filter(Boolean).join(" \u2022 "),t=`${a.mode}:${e.toLowerCase()}`,i=this.auth.isLoggedIn()&&!!e&&t!==this.lastSavedHistoryKey;this.store.search(a).subscribe({next:()=>{i&&this.store.saveHistory(e).subscribe({next:()=>this.lastSavedHistoryKey=t,error:()=>this.lastSavedHistoryKey=t})}})}toggleFavorite(a){if(!this.auth.isLoggedIn()){this.snack.show("Login to save favorites");return}this.fav.favoriteIds().has(a.id)?this.fav.remove(a.id).subscribe(()=>this.snack.show("Removed from favorites")):this.fav.add(a).subscribe(()=>this.snack.show("Saved to favorites"))}share(a){let e=`${location.origin}/recipes/${a.id}`;navigator.share?navigator.share({title:a.name,url:e}).catch(()=>{}):navigator.clipboard?navigator.clipboard.writeText(e).then(()=>this.snack.show("Link copied to clipboard")):this.snack.show(e)}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=f({type:n,selectors:[["app-recipe-search"]],decls:44,vars:3,consts:[[1,"page","page-narrow"],[1,"page-header"],[1,"section-title"],[1,"section-subtitle"],[1,"panel","search-panel",3,"ngSubmit","formGroup"],["appearance","outline"],["matPrefix",""],["matInput","","formControlName","query","placeholder","tomato, onion, paneer"],["formControlName","mode"],["value","ingredients"],["value","name"],["formControlName","cuisine"],["value",""],[3,"value"],["formControlName","category"],["mat-flat-button","","color","primary","type","submit",3,"disabled"],[1,"grid","results"],["icon","search_off","title","No recipes found","description",'Try "tomato, onion" or choose a cuisine above to discover delicious meals.',"actionLabel","Browse All","actionLink","/search"],[1,"results-count"],[3,"recipe","isFavorite","canFavorite"],[3,"favoriteClick","shareClick","recipe","isFavorite","canFavorite"]],template:function(e,t){e&1&&(s(0,"section",0)(1,"div",1)(2,"h1",2),c(3,"Recipe Search"),r(),s(4,"p",3),c(5,"Find the perfect dish using ingredients, cuisine, or recipe name."),r()(),s(6,"form",4),u("ngSubmit",function(){return t.search()}),s(7,"mat-form-field",5)(8,"mat-label"),c(9,"Search text"),r(),s(10,"mat-icon",6),c(11,"search"),r(),b(12,"input",7),r(),s(13,"mat-form-field",5)(14,"mat-label"),c(15,"Mode"),r(),s(16,"mat-select",8)(17,"mat-option",9),c(18,"Ingredients"),r(),s(19,"mat-option",10),c(20,"Recipe Name"),r()()(),s(21,"mat-form-field",5)(22,"mat-label"),c(23,"Cuisine"),r(),s(24,"mat-select",11)(25,"mat-option",12),c(26,"Any"),r(),j(27,Ci,2,2,"mat-option",13,U),r()(),s(29,"mat-form-field",5)(30,"mat-label"),c(31,"Category"),r(),s(32,"mat-select",14)(33,"mat-option",12),c(34,"Any"),r(),j(35,ki,2,2,"mat-option",13,U),r()(),s(37,"button",15)(38,"mat-icon"),c(39,"search"),r(),c(40," Search "),r()(),g(41,Si,3,0,"div",16)(42,wi,1,0,"app-empty-state",17)(43,Ei,5,1),r()),e&2&&(l(6),h("formGroup",t.form),l(21),H(t.store.cuisines()),l(8),H(t.store.categories()),l(2),h("disabled",t.store.loading()),l(4),_(t.store.loading()?41:t.store.recipes().length===0?42:43))},dependencies:[it,Ze,Qe,$e,Xe,ee,et,ae,ne,se,bt,ut,ft,re,oe,Ct,xt,Ht,jt,W,de,me,Vt],styles:[".page-header[_ngcontent-%COMP%]{margin-bottom:8px}.search-panel[_ngcontent-%COMP%]{align-items:start;display:grid;gap:14px;grid-template-columns:2fr 1fr 1fr 1fr auto;margin-bottom:8px}.results[_ngcontent-%COMP%]{margin-top:8px}.results-count[_ngcontent-%COMP%]{color:var(--muted);font-size:.92rem;margin:20px 0 0}@media(max-width:980px){.search-panel[_ngcontent-%COMP%]{grid-template-columns:1fr 1fr}.search-panel[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{grid-column:1/-1}}@media(max-width:620px){.search-panel[_ngcontent-%COMP%]{grid-template-columns:1fr}}"]})};export{Gt as RecipeSearch};
