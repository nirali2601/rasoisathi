import{a as he}from"./chunk-TAJVP6BN.js";import{a as me}from"./chunk-4ONGL5JT.js";import{a as re}from"./chunk-CREDMFZZ.js";import{a as Xt,d as ut,e as Jt,f as te,g as I,h as S,i as Z,k as ee,l as ie,m as ne,n as K,p as ae,s as X,t as oe}from"./chunk-7EN3OMAS.js";import{a as se,b as le,c as ce,d as de}from"./chunk-QWWWYURZ.js";import"./chunk-PZZVSIYK.js";import{d as Wt}from"./chunk-NWLSJVUJ.js";import{A as Yt,B as Q,D as M,N as ht,S as Zt,T as pt,U as Kt,W as q,X as U,Y as $,Z as Y,m as W,o as Qt,p as mt,r as qt,x as Ut,y as $t}from"./chunk-442PSIEZ.js";import{$b as b,Ab as lt,D as C,Hb as Lt,Ib as ct,Lb as A,M as P,Mb as T,Pa as Tt,Qb as Rt,Ra as m,Rb as Bt,Sb as jt,U as D,V as L,Wa as Mt,X as _,Xa as It,Yb as dt,Z as o,Za as St,_b as h,a as u,ac as Nt,b as yt,ca as xt,da as At,eb as v,ec as Vt,fb as N,fc as zt,g as f,ga as g,gb as k,gc as Gt,ha as Ot,i as rt,ib as Et,jb as x,ka as R,kb as V,la as wt,p as Ct,pa as kt,qb as z,rb as G,sb as H,sc as Ht,ua as B,v as F,vb as Ft,wa as j,wb as Pt,x as Dt,xb as st,y as w,yb as c,zb as d}from"./chunk-CEELXM2A.js";function Oe(i,a){}var y=class{viewContainerRef;injector;id;role="dialog";panelClass="";hasBackdrop=!0;backdropClass="";disableClose=!1;closePredicate;width="";height="";minWidth;minHeight;maxWidth;maxHeight;positionStrategy;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus="first-tabbable";restoreFocus=!0;scrollStrategy;closeOnNavigation=!0;closeOnDestroy=!0;closeOnOverlayDetachments=!0;disableAnimations=!1;providers;container;templateContext};var ft=(()=>{class i extends te{_elementRef=o(j);_focusTrapFactory=o($t);_config;_interactivityChecker=o(Ut);_ngZone=o(wt);_focusMonitor=o(qt);_renderer=o(St);_changeDetectorRef=o(Ht);_injector=o(g);_platform=o(Qt);_document=o(Ot);_portalOutlet;_focusTrapped=new f;_focusTrap=null;_elementFocusedBeforeDialogWasOpened=null;_closeInteractionType=null;_ariaLabelledByQueue=[];_isDestroyed=!1;constructor(){super(),this._config=o(y,{optional:!0})||new y,this._config.ariaLabelledBy&&this._ariaLabelledByQueue.push(this._config.ariaLabelledBy)}_addAriaLabelledBy(t){this._ariaLabelledByQueue.push(t),this._changeDetectorRef.markForCheck()}_removeAriaLabelledBy(t){let e=this._ariaLabelledByQueue.indexOf(t);e>-1&&(this._ariaLabelledByQueue.splice(e,1),this._changeDetectorRef.markForCheck())}_contentAttached(){this._initializeFocusTrap(),this._captureInitialFocus()}_captureInitialFocus(){this._trapFocus()}ngOnDestroy(){this._focusTrapped.complete(),this._isDestroyed=!0,this._restoreFocus()}attachComponentPortal(t){this._portalOutlet.hasAttached();let e=this._portalOutlet.attachComponentPortal(t);return this._contentAttached(),e}attachTemplatePortal(t){this._portalOutlet.hasAttached();let e=this._portalOutlet.attachTemplatePortal(t);return this._contentAttached(),e}attachDomPortal=t=>{this._portalOutlet.hasAttached();let e=this._portalOutlet.attachDomPortal(t);return this._contentAttached(),e};_recaptureFocus(){this._containsFocus()||this._trapFocus()}_forceFocus(t,e){this._interactivityChecker.isFocusable(t)||(t.tabIndex=-1,this._ngZone.runOutsideAngular(()=>{let n=()=>{r(),l(),t.removeAttribute("tabindex")},r=this._renderer.listen(t,"blur",n),l=this._renderer.listen(t,"mousedown",n)})),t.focus(e)}_focusByCssSelector(t,e){let n=this._elementRef.nativeElement.querySelector(t);n&&this._forceFocus(n,e)}_trapFocus(t){this._isDestroyed||Mt(()=>{let e=this._elementRef.nativeElement;switch(this._config.autoFocus){case!1:case"dialog":this._containsFocus()||e.focus(t);break;case!0:case"first-tabbable":this._focusTrap?.focusInitialElement(t)||this._focusDialogContainer(t);break;case"first-heading":this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]',t);break;default:this._focusByCssSelector(this._config.autoFocus,t);break}this._focusTrapped.next()},{injector:this._injector})}_restoreFocus(){let t=this._config.restoreFocus,e=null;if(typeof t=="string"?e=this._document.querySelector(t):typeof t=="boolean"?e=t?this._elementFocusedBeforeDialogWasOpened:null:t&&(e=t),this._config.restoreFocus&&e&&typeof e.focus=="function"){let n=W(),r=this._elementRef.nativeElement;(!n||n===this._document.body||n===r||r.contains(n))&&(this._focusMonitor?(this._focusMonitor.focusVia(e,this._closeInteractionType),this._closeInteractionType=null):e.focus())}this._focusTrap&&this._focusTrap.destroy()}_focusDialogContainer(t){this._elementRef.nativeElement.focus?.(t)}_containsFocus(){let t=this._elementRef.nativeElement,e=W();return t===e||t.contains(e)}_initializeFocusTrap(){this._platform.isBrowser&&(this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._document&&(this._elementFocusedBeforeDialogWasOpened=W()))}static \u0275fac=function(e){return new(e||i)};static \u0275cmp=v({type:i,selectors:[["cdk-dialog-container"]],viewQuery:function(e,n){if(e&1&&Rt(I,7),e&2){let r;Bt(r=jt())&&(n._portalOutlet=r.first)}},hostAttrs:["tabindex","-1",1,"cdk-dialog-container"],hostVars:6,hostBindings:function(e,n){e&2&&z("id",n._config.id||null)("role",n._config.role)("aria-modal",n._config.ariaModal)("aria-labelledby",n._config.ariaLabel?null:n._ariaLabelledByQueue[0])("aria-label",n._config.ariaLabel)("aria-describedby",n._config.ariaDescribedBy||null)},features:[x],decls:1,vars:0,consts:[["cdkPortalOutlet",""]],template:function(e,n){e&1&&V(0,Oe,0,0,"ng-template",0)},dependencies:[I],styles:[`.cdk-dialog-container {
  display: block;
  width: 100%;
  height: 100%;
  min-height: inherit;
  max-height: inherit;
}
`],encapsulation:2})}return i})(),E=class{overlayRef;config;componentInstance=null;componentRef=null;containerInstance;disableClose;closed=new f;backdropClick;keydownEvents;outsidePointerEvents;id;_detachSubscription;constructor(a,t){this.overlayRef=a,this.config=t,this.disableClose=t.disableClose,this.backdropClick=a.backdropClick(),this.keydownEvents=a.keydownEvents(),this.outsidePointerEvents=a.outsidePointerEvents(),this.id=t.id,this.keydownEvents.subscribe(e=>{e.keyCode===27&&!this.disableClose&&!Q(e)&&(e.preventDefault(),this.close(void 0,{focusOrigin:"keyboard"}))}),this.backdropClick.subscribe(()=>{!this.disableClose&&this._canClose()?this.close(void 0,{focusOrigin:"mouse"}):this.containerInstance._recaptureFocus?.()}),this._detachSubscription=a.detachments().subscribe(()=>{t.closeOnOverlayDetachments!==!1&&this.close()})}close(a,t){if(this._canClose(a)){let e=this.closed;this.containerInstance._closeInteractionType=t?.focusOrigin||"program",this._detachSubscription.unsubscribe(),this.overlayRef.dispose(),e.next(a),e.complete(),this.componentInstance=this.containerInstance=null}}updatePosition(){return this.overlayRef.updatePosition(),this}updateSize(a="",t=""){return this.overlayRef.updateSize({width:a,height:t}),this}addPanelClass(a){return this.overlayRef.addPanelClass(a),this}removePanelClass(a){return this.overlayRef.removePanelClass(a),this}_canClose(a){let t=this.config;return!!this.containerInstance&&(!t.closePredicate||t.closePredicate(a,t,this.componentInstance))}},we=new _("DialogScrollStrategy",{providedIn:"root",factory:()=>{let i=o(g);return()=>Z(i)}}),ke=new _("DialogData"),Te=new _("DefaultDialogConfig");function Me(i){let a=kt(i),t=new R;return{valueSignal:a,get value(){return a()},change:t,ngOnDestroy(){t.complete()}}}var _t=(()=>{class i{_injector=o(g);_defaultOptions=o(Te,{optional:!0});_parentDialog=o(i,{optional:!0,skipSelf:!0});_overlayContainer=o(ie);_idGenerator=o(M);_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new f;_afterOpenedAtThisLevel=new f;_ariaHiddenElements=new Map;_scrollStrategy=o(we);get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}afterAllClosed=F(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(P(void 0)));constructor(){}open(t,e){let n=this._defaultOptions||new y;e=u(u({},n),e),e.id=e.id||this._idGenerator.getId("cdk-dialog-"),e.id&&this.getDialogById(e.id);let r=this._getOverlayConfig(e),l=ae(this._injector,r),s=new E(l,e),p=this._attachContainer(l,s,e);if(s.containerInstance=p,!this.openDialogs.length){let ot=this._overlayContainer.getContainerElement();p._focusTrapped?p._focusTrapped.pipe(C(1)).subscribe(()=>{this._hideNonDialogContentFromAssistiveTechnology(ot)}):this._hideNonDialogContentFromAssistiveTechnology(ot)}return this._attachDialogContent(t,s,p,e),this.openDialogs.push(s),s.closed.subscribe(()=>this._removeOpenDialog(s,!0)),this.afterOpened.next(s),s}closeAll(){gt(this.openDialogs,t=>t.close())}getDialogById(t){return this.openDialogs.find(e=>e.id===t)}ngOnDestroy(){gt(this._openDialogsAtThisLevel,t=>{t.config.closeOnDestroy===!1&&this._removeOpenDialog(t,!1)}),gt(this._openDialogsAtThisLevel,t=>t.close()),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete(),this._openDialogsAtThisLevel=[]}_getOverlayConfig(t){let e=new ee({positionStrategy:t.positionStrategy||K().centerHorizontally().centerVertically(),scrollStrategy:t.scrollStrategy||this._scrollStrategy(),panelClass:t.panelClass,hasBackdrop:t.hasBackdrop,direction:t.direction,minWidth:t.minWidth,minHeight:t.minHeight,maxWidth:t.maxWidth,maxHeight:t.maxHeight,width:t.width,height:t.height,disposeOnNavigation:t.closeOnNavigation,disableAnimations:t.disableAnimations});return t.backdropClass&&(e.backdropClass=t.backdropClass),e}_attachContainer(t,e,n){let r=n.injector||n.viewContainerRef?.injector,l=[{provide:y,useValue:n},{provide:E,useValue:e},{provide:ne,useValue:t}],s;n.container?typeof n.container=="function"?s=n.container:(s=n.container.type,l.push(...n.container.providers(n))):s=ft;let p=new ut(s,n.viewContainerRef,g.create({parent:r||this._injector,providers:l}));return t.attach(p).instance}_attachDialogContent(t,e,n,r){if(t instanceof It){let l=this._createInjector(r,e,n,void 0),s={$implicit:r.data,dialogRef:e};r.templateContext&&(s=u(u({},s),typeof r.templateContext=="function"?r.templateContext():r.templateContext)),n.attachTemplatePortal(new Jt(t,null,s,l))}else{let l=this._createInjector(r,e,n,this._injector),s=n.attachComponentPortal(new ut(t,r.viewContainerRef,l));e.componentRef=s,e.componentInstance=s.instance}}_createInjector(t,e,n,r){let l=t.injector||t.viewContainerRef?.injector,s=[{provide:ke,useValue:t.data},{provide:E,useValue:e}];return t.providers&&(typeof t.providers=="function"?s.push(...t.providers(e,t,n)):s.push(...t.providers)),t.direction&&(!l||!l.get(pt,null,{optional:!0}))&&s.push({provide:pt,useValue:Me(t.direction)}),g.create({parent:l||r,providers:s})}_removeOpenDialog(t,e){let n=this.openDialogs.indexOf(t);n>-1&&(this.openDialogs.splice(n,1),this.openDialogs.length||(this._ariaHiddenElements.forEach((r,l)=>{r?l.setAttribute("aria-hidden",r):l.removeAttribute("aria-hidden")}),this._ariaHiddenElements.clear(),e&&this._getAfterAllClosed().next()))}_hideNonDialogContentFromAssistiveTechnology(t){if(t.parentElement){let e=t.parentElement.children;for(let n=e.length-1;n>-1;n--){let r=e[n];r!==t&&r.nodeName!=="SCRIPT"&&r.nodeName!=="STYLE"&&!r.hasAttribute("aria-live")&&!r.hasAttribute("popover")&&(this._ariaHiddenElements.set(r,r.getAttribute("aria-hidden")),r.setAttribute("aria-hidden","true"))}}}_getAfterAllClosed(){let t=this._parentDialog;return t?t._getAfterAllClosed():this._afterAllClosedAtThisLevel}static \u0275fac=function(e){return new(e||i)};static \u0275prov=D({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function gt(i,a){let t=i.length;for(;t--;)a(i[t])}var ue=(()=>{class i{static \u0275fac=function(e){return new(e||i)};static \u0275mod=N({type:i});static \u0275inj=L({providers:[_t],imports:[X,S,Yt,S]})}return i})();function Ie(i,a){}var et=class{viewContainerRef;injector;id;role="dialog";panelClass="";hasBackdrop=!0;backdropClass="";disableClose=!1;closePredicate;width="";height="";minWidth;minHeight;maxWidth;maxHeight;position;data=null;direction;ariaDescribedBy=null;ariaLabelledBy=null;ariaLabel=null;ariaModal=!1;autoFocus="first-tabbable";restoreFocus=!0;delayFocusTrap=!0;scrollStrategy;closeOnNavigation=!0;enterAnimationDuration;exitAnimationDuration},vt="mdc-dialog--open",ge="mdc-dialog--opening",fe="mdc-dialog--closing",Se=150,Ee=75,Fe=(()=>{class i extends ft{_animationStateChanged=new R;_animationsEnabled=!ht();_actionSectionCount=0;_hostElement=this._elementRef.nativeElement;_enterAnimationDuration=this._animationsEnabled?ve(this._config.enterAnimationDuration)??Se:0;_exitAnimationDuration=this._animationsEnabled?ve(this._config.exitAnimationDuration)??Ee:0;_animationTimer=null;_contentAttached(){super._contentAttached(),this._startOpenAnimation()}_startOpenAnimation(){this._animationStateChanged.emit({state:"opening",totalTime:this._enterAnimationDuration}),this._animationsEnabled?(this._hostElement.style.setProperty(_e,`${this._enterAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(ge,vt)),this._waitForAnimationToComplete(this._enterAnimationDuration,this._finishDialogOpen)):(this._hostElement.classList.add(vt),Promise.resolve().then(()=>this._finishDialogOpen()))}_startExitAnimation(){this._animationStateChanged.emit({state:"closing",totalTime:this._exitAnimationDuration}),this._hostElement.classList.remove(vt),this._animationsEnabled?(this._hostElement.style.setProperty(_e,`${this._exitAnimationDuration}ms`),this._requestAnimationFrame(()=>this._hostElement.classList.add(fe)),this._waitForAnimationToComplete(this._exitAnimationDuration,this._finishDialogClose)):Promise.resolve().then(()=>this._finishDialogClose())}_updateActionSectionCount(t){this._actionSectionCount+=t,this._changeDetectorRef.markForCheck()}_finishDialogOpen=()=>{this._clearAnimationClasses(),this._openAnimationDone(this._enterAnimationDuration)};_finishDialogClose=()=>{this._clearAnimationClasses(),this._animationStateChanged.emit({state:"closed",totalTime:this._exitAnimationDuration})};_clearAnimationClasses(){this._hostElement.classList.remove(ge,fe)}_waitForAnimationToComplete(t,e){this._animationTimer!==null&&clearTimeout(this._animationTimer),this._animationTimer=setTimeout(e,t)}_requestAnimationFrame(t){this._ngZone.runOutsideAngular(()=>{typeof requestAnimationFrame=="function"?requestAnimationFrame(t):t()})}_captureInitialFocus(){this._config.delayFocusTrap||this._trapFocus()}_openAnimationDone(t){this._config.delayFocusTrap&&this._trapFocus(),this._animationStateChanged.next({state:"opened",totalTime:t})}ngOnDestroy(){super.ngOnDestroy(),this._animationTimer!==null&&clearTimeout(this._animationTimer)}attachComponentPortal(t){let e=super.attachComponentPortal(t);return e.location.nativeElement.classList.add("mat-mdc-dialog-component-host"),e}static \u0275fac=(()=>{let t;return function(n){return(t||(t=B(i)))(n||i)}})();static \u0275cmp=v({type:i,selectors:[["mat-dialog-container"]],hostAttrs:["tabindex","-1",1,"mat-mdc-dialog-container","mdc-dialog"],hostVars:10,hostBindings:function(e,n){e&2&&(ct("id",n._config.id),z("aria-modal",n._config.ariaModal)("role",n._config.role)("aria-labelledby",n._config.ariaLabel?null:n._ariaLabelledByQueue[0])("aria-label",n._config.ariaLabel)("aria-describedby",n._config.ariaDescribedBy||null),dt("_mat-animation-noopable",!n._animationsEnabled)("mat-mdc-dialog-container-with-actions",n._actionSectionCount>0))},features:[x],decls:3,vars:0,consts:[[1,"mat-mdc-dialog-inner-container","mdc-dialog__container"],[1,"mat-mdc-dialog-surface","mdc-dialog__surface"],["cdkPortalOutlet",""]],template:function(e,n){e&1&&(c(0,"div",0)(1,"div",1),V(2,Ie,0,0,"ng-template",2),d()())},dependencies:[I],styles:[`.mat-mdc-dialog-container {
  width: 100%;
  height: 100%;
  display: block;
  box-sizing: border-box;
  max-height: inherit;
  min-height: inherit;
  min-width: inherit;
  max-width: inherit;
  outline: 0;
}

.cdk-overlay-pane.mat-mdc-dialog-panel {
  max-width: var(--mat-dialog-container-max-width, 560px);
  min-width: var(--mat-dialog-container-min-width, 280px);
}
@media (max-width: 599px) {
  .cdk-overlay-pane.mat-mdc-dialog-panel {
    max-width: var(--mat-dialog-container-small-max-width, calc(100vw - 32px));
  }
}

.mat-mdc-dialog-inner-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  height: 100%;
  opacity: 0;
  transition: opacity linear var(--mat-dialog-transition-duration, 0ms);
  max-height: inherit;
  min-height: inherit;
  min-width: inherit;
  max-width: inherit;
}
.mdc-dialog--closing .mat-mdc-dialog-inner-container {
  transition: opacity 75ms linear;
  transform: none;
}
.mdc-dialog--open .mat-mdc-dialog-inner-container {
  opacity: 1;
}
._mat-animation-noopable .mat-mdc-dialog-inner-container {
  transition: none;
}

.mat-mdc-dialog-surface {
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: auto;
  outline: 0;
  transform: scale(0.8);
  transition: transform var(--mat-dialog-transition-duration, 0ms) cubic-bezier(0, 0, 0.2, 1);
  max-height: inherit;
  min-height: inherit;
  min-width: inherit;
  max-width: inherit;
  box-shadow: var(--mat-dialog-container-elevation-shadow, none);
  border-radius: var(--mat-dialog-container-shape, var(--mat-sys-corner-extra-large, 4px));
  background-color: var(--mat-dialog-container-color, var(--mat-sys-surface, white));
}
[dir=rtl] .mat-mdc-dialog-surface {
  text-align: right;
}
.mdc-dialog--open .mat-mdc-dialog-surface, .mdc-dialog--closing .mat-mdc-dialog-surface {
  transform: none;
}
._mat-animation-noopable .mat-mdc-dialog-surface {
  transition: none;
}
.mat-mdc-dialog-surface::before {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 2px solid transparent;
  border-radius: inherit;
  content: "";
  pointer-events: none;
}

.mat-mdc-dialog-title {
  display: block;
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
  margin: 0 0 1px;
  padding: var(--mat-dialog-headline-padding, 6px 24px 13px);
}
.mat-mdc-dialog-title::before {
  display: inline-block;
  width: 0;
  height: 40px;
  content: "";
  vertical-align: 0;
}
[dir=rtl] .mat-mdc-dialog-title {
  text-align: right;
}
.mat-mdc-dialog-container .mat-mdc-dialog-title {
  color: var(--mat-dialog-subhead-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));
  font-family: var(--mat-dialog-subhead-font, var(--mat-sys-headline-small-font, inherit));
  line-height: var(--mat-dialog-subhead-line-height, var(--mat-sys-headline-small-line-height, 1.5rem));
  font-size: var(--mat-dialog-subhead-size, var(--mat-sys-headline-small-size, 1rem));
  font-weight: var(--mat-dialog-subhead-weight, var(--mat-sys-headline-small-weight, 400));
  letter-spacing: var(--mat-dialog-subhead-tracking, var(--mat-sys-headline-small-tracking, 0.03125em));
}

.mat-mdc-dialog-content {
  display: block;
  flex-grow: 1;
  box-sizing: border-box;
  margin: 0;
  overflow: auto;
  max-height: 65vh;
}
.mat-mdc-dialog-content > :first-child {
  margin-top: 0;
}
.mat-mdc-dialog-content > :last-child {
  margin-bottom: 0;
}
.mat-mdc-dialog-container .mat-mdc-dialog-content {
  color: var(--mat-dialog-supporting-text-color, var(--mat-sys-on-surface-variant, rgba(0, 0, 0, 0.6)));
  font-family: var(--mat-dialog-supporting-text-font, var(--mat-sys-body-medium-font, inherit));
  line-height: var(--mat-dialog-supporting-text-line-height, var(--mat-sys-body-medium-line-height, 1.5rem));
  font-size: var(--mat-dialog-supporting-text-size, var(--mat-sys-body-medium-size, 1rem));
  font-weight: var(--mat-dialog-supporting-text-weight, var(--mat-sys-body-medium-weight, 400));
  letter-spacing: var(--mat-dialog-supporting-text-tracking, var(--mat-sys-body-medium-tracking, 0.03125em));
}
.mat-mdc-dialog-container .mat-mdc-dialog-content {
  padding: var(--mat-dialog-content-padding, 20px 24px);
}
.mat-mdc-dialog-container-with-actions .mat-mdc-dialog-content {
  padding: var(--mat-dialog-with-actions-content-padding, 20px 24px 0);
}
.mat-mdc-dialog-container .mat-mdc-dialog-title + .mat-mdc-dialog-content {
  padding-top: 0;
}

.mat-mdc-dialog-actions {
  display: flex;
  position: relative;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  box-sizing: border-box;
  min-height: 52px;
  margin: 0;
  border-top: 1px solid transparent;
  padding: var(--mat-dialog-actions-padding, 16px 24px);
  justify-content: var(--mat-dialog-actions-alignment, flex-end);
}
@media (forced-colors: active) {
  .mat-mdc-dialog-actions {
    border-top-color: CanvasText;
  }
}
.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-start, .mat-mdc-dialog-actions[align=start] {
  justify-content: start;
}
.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-center, .mat-mdc-dialog-actions[align=center] {
  justify-content: center;
}
.mat-mdc-dialog-actions.mat-mdc-dialog-actions-align-end, .mat-mdc-dialog-actions[align=end] {
  justify-content: flex-end;
}
.mat-mdc-dialog-actions .mat-button-base + .mat-button-base,
.mat-mdc-dialog-actions .mat-mdc-button-base + .mat-mdc-button-base {
  margin-left: 8px;
}
[dir=rtl] .mat-mdc-dialog-actions .mat-button-base + .mat-button-base,
[dir=rtl] .mat-mdc-dialog-actions .mat-mdc-button-base + .mat-mdc-button-base {
  margin-left: 0;
  margin-right: 8px;
}

.mat-mdc-dialog-component-host {
  display: contents;
}
`],encapsulation:2})}return i})(),_e="--mat-dialog-transition-duration";function ve(i){return i==null?null:typeof i=="number"?i:i.endsWith("ms")?mt(i.substring(0,i.length-2)):i.endsWith("s")?mt(i.substring(0,i.length-1))*1e3:i==="0"?0:null}var tt=(function(i){return i[i.OPEN=0]="OPEN",i[i.CLOSING=1]="CLOSING",i[i.CLOSED=2]="CLOSED",i})(tt||{}),O=class{_ref;_config;_containerInstance;componentInstance;componentRef=null;disableClose;id;_afterOpened=new rt(1);_beforeClosed=new rt(1);_result;_closeFallbackTimeout;_state=tt.OPEN;_closeInteractionType;constructor(a,t,e){this._ref=a,this._config=t,this._containerInstance=e,this.disableClose=t.disableClose,this.id=a.id,a.addPanelClass("mat-mdc-dialog-panel"),e._animationStateChanged.pipe(w(n=>n.state==="opened"),C(1)).subscribe(()=>{this._afterOpened.next(),this._afterOpened.complete()}),e._animationStateChanged.pipe(w(n=>n.state==="closed"),C(1)).subscribe(()=>{clearTimeout(this._closeFallbackTimeout),this._finishDialogClose()}),a.overlayRef.detachments().subscribe(()=>{this._beforeClosed.next(this._result),this._beforeClosed.complete(),this._finishDialogClose()}),Dt(this.backdropClick(),this.keydownEvents().pipe(w(n=>n.keyCode===27&&!this.disableClose&&!Q(n)))).subscribe(n=>{this.disableClose||(n.preventDefault(),Pe(this,n.type==="keydown"?"keyboard":"mouse"))})}close(a){let t=this._config.closePredicate;t&&!t(a,this._config,this.componentInstance)||(this._result=a,this._containerInstance._animationStateChanged.pipe(w(e=>e.state==="closing"),C(1)).subscribe(e=>{this._beforeClosed.next(a),this._beforeClosed.complete(),this._ref.overlayRef.detachBackdrop(),this._closeFallbackTimeout=setTimeout(()=>this._finishDialogClose(),e.totalTime+100)}),this._state=tt.CLOSING,this._containerInstance._startExitAnimation())}afterOpened(){return this._afterOpened}afterClosed(){return this._ref.closed}beforeClosed(){return this._beforeClosed}backdropClick(){return this._ref.backdropClick}keydownEvents(){return this._ref.keydownEvents}updatePosition(a){let t=this._ref.config.positionStrategy;return a&&(a.left||a.right)?a.left?t.left(a.left):t.right(a.right):t.centerHorizontally(),a&&(a.top||a.bottom)?a.top?t.top(a.top):t.bottom(a.bottom):t.centerVertically(),this._ref.updatePosition(),this}updateSize(a="",t=""){return this._ref.updateSize(a,t),this}addPanelClass(a){return this._ref.addPanelClass(a),this}removePanelClass(a){return this._ref.removePanelClass(a),this}getState(){return this._state}_finishDialogClose(){this._state=tt.CLOSED,this._ref.close(this._result,{focusOrigin:this._closeInteractionType}),this.componentInstance=null}};function Pe(i,a,t){return i._closeInteractionType=a,i.close(t)}var bt=new _("MatMdcDialogData"),Le=new _("mat-mdc-dialog-default-options"),Re=new _("mat-mdc-dialog-scroll-strategy",{providedIn:"root",factory:()=>{let i=o(g);return()=>Z(i)}}),it=(()=>{class i{_defaultOptions=o(Le,{optional:!0});_scrollStrategy=o(Re);_parentDialog=o(i,{optional:!0,skipSelf:!0});_idGenerator=o(M);_injector=o(g);_dialog=o(_t);_animationsDisabled=ht();_openDialogsAtThisLevel=[];_afterAllClosedAtThisLevel=new f;_afterOpenedAtThisLevel=new f;dialogConfigClass=et;_dialogRefConstructor;_dialogContainerType;_dialogDataToken;get openDialogs(){return this._parentDialog?this._parentDialog.openDialogs:this._openDialogsAtThisLevel}get afterOpened(){return this._parentDialog?this._parentDialog.afterOpened:this._afterOpenedAtThisLevel}_getAfterAllClosed(){let t=this._parentDialog;return t?t._getAfterAllClosed():this._afterAllClosedAtThisLevel}afterAllClosed=F(()=>this.openDialogs.length?this._getAfterAllClosed():this._getAfterAllClosed().pipe(P(void 0)));constructor(){this._dialogRefConstructor=O,this._dialogContainerType=Fe,this._dialogDataToken=bt}open(t,e){let n;e=u(u({},this._defaultOptions||new et),e),e.id=e.id||this._idGenerator.getId("mat-mdc-dialog-"),e.scrollStrategy=e.scrollStrategy||this._scrollStrategy();let r=this._dialog.open(t,yt(u({},e),{positionStrategy:K(this._injector).centerHorizontally().centerVertically(),disableClose:!0,closePredicate:void 0,closeOnDestroy:!1,closeOnOverlayDetachments:!1,disableAnimations:this._animationsDisabled||e.enterAnimationDuration?.toLocaleString()==="0"||e.exitAnimationDuration?.toString()==="0",container:{type:this._dialogContainerType,providers:()=>[{provide:this.dialogConfigClass,useValue:e},{provide:y,useValue:e}]},templateContext:()=>({dialogRef:n}),providers:(l,s,p)=>(n=new this._dialogRefConstructor(l,e,p),n.updatePosition(e?.position),[{provide:this._dialogContainerType,useValue:p},{provide:this._dialogDataToken,useValue:s.data},{provide:this._dialogRefConstructor,useValue:n}])}));return n.componentRef=r.componentRef,n.componentInstance=r.componentInstance,this.openDialogs.push(n),this.afterOpened.next(n),n.afterClosed().subscribe(()=>{let l=this.openDialogs.indexOf(n);l>-1&&(this.openDialogs.splice(l,1),this.openDialogs.length||this._getAfterAllClosed().next())}),n}closeAll(){this._closeDialogs(this.openDialogs)}getDialogById(t){return this.openDialogs.find(e=>e.id===t)}ngOnDestroy(){this._closeDialogs(this._openDialogsAtThisLevel),this._afterAllClosedAtThisLevel.complete(),this._afterOpenedAtThisLevel.complete()}_closeDialogs(t){let e=t.length;for(;e--;)t[e].close()}static \u0275fac=function(e){return new(e||i)};static \u0275prov=D({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var be=(()=>{class i{_dialogRef=o(O,{optional:!0});_elementRef=o(j);_dialog=o(it);constructor(){}ngOnInit(){this._dialogRef||(this._dialogRef=Be(this._elementRef,this._dialog.openDialogs)),this._dialogRef&&Promise.resolve().then(()=>{this._onAdd()})}ngOnDestroy(){this._dialogRef?._containerInstance&&Promise.resolve().then(()=>{this._onRemove()})}static \u0275fac=function(e){return new(e||i)};static \u0275dir=k({type:i})}return i})(),ye=(()=>{class i extends be{id=o(M).getId("mat-mdc-dialog-title-");_onAdd(){this._dialogRef._containerInstance?._addAriaLabelledBy?.(this.id)}_onRemove(){this._dialogRef?._containerInstance?._removeAriaLabelledBy?.(this.id)}static \u0275fac=(()=>{let t;return function(n){return(t||(t=B(i)))(n||i)}})();static \u0275dir=k({type:i,selectors:[["","mat-dialog-title",""],["","matDialogTitle",""]],hostAttrs:[1,"mat-mdc-dialog-title","mdc-dialog__title"],hostVars:1,hostBindings:function(e,n){e&2&&ct("id",n.id)},inputs:{id:"id"},exportAs:["matDialogTitle"],features:[x]})}return i})(),Ce=(()=>{class i{static \u0275fac=function(e){return new(e||i)};static \u0275dir=k({type:i,selectors:[["","mat-dialog-content",""],["mat-dialog-content"],["","matDialogContent",""]],hostAttrs:[1,"mat-mdc-dialog-content","mdc-dialog__content"],features:[Et([Xt])]})}return i})(),De=(()=>{class i extends be{align;_onAdd(){this._dialogRef._containerInstance?._updateActionSectionCount?.(1)}_onRemove(){this._dialogRef._containerInstance?._updateActionSectionCount?.(-1)}static \u0275fac=(()=>{let t;return function(n){return(t||(t=B(i)))(n||i)}})();static \u0275dir=k({type:i,selectors:[["","mat-dialog-actions",""],["mat-dialog-actions"],["","matDialogActions",""]],hostAttrs:[1,"mat-mdc-dialog-actions","mdc-dialog__actions"],hostVars:6,hostBindings:function(e,n){e&2&&dt("mat-mdc-dialog-actions-align-start",n.align==="start")("mat-mdc-dialog-actions-align-center",n.align==="center")("mat-mdc-dialog-actions-align-end",n.align==="end")},inputs:{align:"align"},features:[x]})}return i})();function Be(i,a){let t=i.nativeElement.parentElement;for(;t&&!t.classList.contains("mat-mdc-dialog-container");)t=t.parentElement;return t?a.find(e=>e.id===t.id):null}var xe=(()=>{class i{static \u0275fac=function(e){return new(e||i)};static \u0275mod=N({type:i});static \u0275inj=L({providers:[it],imports:[ue,X,S,Kt]})}return i})();function Ge(i,a){if(i&1&&(c(0,"div",1)(1,"mat-icon"),h(2),d()()),i&2){let t=T();m(2),b(t.data.icon)}}var nt=class i{data=o(bt);ref=o(O);static \u0275fac=function(t){return new(t||i)};static \u0275cmp=v({type:i,selectors:[["app-confirm-dialog"]],decls:12,vars:5,consts:[[1,"confirm-dialog"],[1,"icon-wrap"],["mat-dialog-title",""],["align","end"],["mat-stroked-button","",3,"click"],["mat-flat-button","","color","warn",3,"click"]],template:function(t,e){t&1&&(c(0,"div",0),G(1,Ge,3,1,"div",1),c(2,"h2",2),h(3),d(),c(4,"mat-dialog-content")(5,"p"),h(6),d()(),c(7,"mat-dialog-actions",3)(8,"button",4),A("click",function(){return e.ref.close(!1)}),h(9),d(),c(10,"button",5),A("click",function(){return e.ref.close(!0)}),h(11),d()()()),t&2&&(m(),H(e.data.icon?1:-1),m(2),b(e.data.title),m(3),b(e.data.message),m(3),b(e.data.cancelLabel||"Cancel"),m(2),b(e.data.confirmLabel||"Confirm"))},dependencies:[xe,ye,De,Ce,U,q,Y,$],styles:[".confirm-dialog[_ngcontent-%COMP%]{padding:8px 4px 0}.icon-wrap[_ngcontent-%COMP%]{align-items:center;background:#fff1eb;border-radius:50%;display:flex;height:52px;justify-content:center;margin:0 auto 8px;width:52px}.icon-wrap[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:var(--primary)}h2[_ngcontent-%COMP%]{font-size:1.2rem;margin:0;text-align:center}p[_ngcontent-%COMP%]{color:var(--muted);line-height:1.5;margin:0;text-align:center}mat-dialog-actions[_ngcontent-%COMP%]{gap:8px;padding-top:16px}"]})};var at=class i{dialog=o(it);async confirm(a){let t=this.dialog.open(nt,{data:a,width:"400px",panelClass:"premium-dialog"});return Ct(t.afterClosed()).then(e=>!!e)}static \u0275fac=function(t){return new(t||i)};static \u0275prov=D({token:i,factory:i.\u0275fac,providedIn:"root"})};var He=i=>["/recipes",i],We=(i,a)=>a.recipe_id;function Qe(i,a){i&1&&lt(0,"app-empty-state",4)}function qe(i,a){if(i&1){let t=Lt();c(0,"mat-card",6)(1,"div",7),lt(2,"img",8),c(3,"button",9),A("click",function(){let n=xt(t).$implicit,r=T(2);return At(r.remove(n.recipe_id))}),c(4,"mat-icon"),h(5,"close"),d()()(),c(6,"mat-card-content")(7,"h3"),h(8),d(),c(9,"span",10),h(10),zt(11,"istDate"),d()(),c(12,"mat-card-actions")(13,"a",11)(14,"mat-icon"),h(15,"restaurant"),d(),h(16," Open Recipe "),d()()()}if(i&2){let t=a.$implicit;m(2),st("src",t.recipe_image,Tt)("alt",t.recipe_name),m(6),b(t.recipe_name),m(2),Nt("Saved ",Gt(11,5,t.created_at)),m(3),st("routerLink",Vt(7,He,t.recipe_id))}}function Ue(i,a){if(i&1&&(c(0,"div",5),Ft(1,qe,17,9,"mat-card",6,We),d()),i&2){let t=T();m(),Pt(t.fav.favorites())}}var Ae=class i{fav=o(re);snack=o(oe);confirm=o(at);ngOnInit(){this.fav.load().subscribe()}async remove(a){await this.confirm.confirm({title:"Remove Favorite?",message:"This recipe will be removed from your favorites list.",confirmLabel:"Remove",icon:"delete_outline"})&&this.fav.remove(a).subscribe(()=>this.snack.show("Favorite removed"))}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=v({type:i,selectors:[["app-favorites"]],decls:8,vars:1,consts:[[1,"page","page-narrow"],[1,"page-header"],[1,"section-title"],[1,"section-subtitle"],["icon","favorite_border","title","No favorites saved yet","description","Browse recipes and tap the bookmark icon to save them here.","actionLabel","Explore Recipes","actionLink","/search"],[1,"grid"],[1,"fav-card"],[1,"img-wrap"],["loading","lazy","onerror","this.onerror=null;this.parentElement.classList.add('img-fallback')",3,"src","alt"],["mat-icon-button","","aria-label","Remove favorite",1,"remove-btn",3,"click"],[1,"meta","ist-date"],["mat-flat-button","","color","primary",3,"routerLink"]],template:function(t,e){t&1&&(c(0,"section",0)(1,"div",1)(2,"h1",2),h(3,"Favorite Recipes"),d(),c(4,"p",3),h(5,"Every dish you have bookmarked, ready for your next cooking session."),d()(),G(6,Qe,1,0,"app-empty-state",4)(7,Ue,3,0,"div",5),d()),t&2&&(m(6),H(e.fav.favorites().length===0?6:7))},dependencies:[Wt,U,q,Zt,de,se,ce,le,Y,$,me,he],styles:[".page-header[_ngcontent-%COMP%]{margin-bottom:8px}.fav-card[_ngcontent-%COMP%]{border:1px solid var(--border);border-radius:var(--radius-lg)!important;display:flex;flex-direction:column;overflow:hidden;transition:transform .25s ease,box-shadow .25s ease}.fav-card[_ngcontent-%COMP%]:hover{box-shadow:var(--shadow);transform:translateY(-4px)}.img-wrap[_ngcontent-%COMP%]{aspect-ratio:4/3;background:linear-gradient(135deg,#ffe4d1,#ffd0e0);overflow:hidden;position:relative}.img-wrap[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:100%;object-fit:cover;transition:transform .35s ease;width:100%}.fav-card[_ngcontent-%COMP%]:hover   .img-wrap[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{transform:scale(1.06)}.img-wrap.img-fallback[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{display:none}.remove-btn[_ngcontent-%COMP%]{background:#ffffffe6!important;position:absolute!important;right:8px;top:8px}h3[_ngcontent-%COMP%]{font-size:1.05rem;margin:0 0 6px}mat-card-content[_ngcontent-%COMP%]{padding:16px 18px 8px!important}mat-card-actions[_ngcontent-%COMP%]{padding:4px 12px 16px!important}mat-card-actions[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{border-radius:999px!important;width:100%}"]})};export{Ae as Favorites};
