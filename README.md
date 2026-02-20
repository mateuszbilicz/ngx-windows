# Angular Windows

Angular version: 21.1.5

Previous versions of Angular aren't supported.

License: ISC

# Using Angular Windows

## Installation

Install ngx-windows: `npm i ngx-windows`.
Edit, build and use in example app: `npm run update-ngx-windows`.

Add ngx-windows style to your angular.json config file:

```json
"styles": [
  "./node_modules/ngx-windows/ngx-windows-style.css",
  "src/styles.scss"
]
```

## Usage

1. You should provide NgwWindowsManagerService in app config
   or if you need multiple instances - in specific component that will
   contain windows.

2. Add NgwWindowsContainerComponent to your template

```angular21html
<ngw-windows-container [style]="{width: '100vw', height: '100vh'}"/>
```

You must set width and height of this container for windows.

Current version uses only window inner width and height.

3. Creating window

In any component inject NgwWindowsManagerService and use it commands to control, filter and manage windows globally.
You must provide class of component that will be displayed inside window.
Component should have overflow:auto, width:100% and height:100% for more fail-safe experience.
If you want to change window component while window is already active you need to
use `NgwWindowsManagerService.findFN.component = AnotherComponent`.

```typescript
export class YourComponent {
  constructor(public nwm: NgwWindowsManagerService,
              private destroyRef: DestroyRef) {
    const win = this.nwm.createWindow({
      name: 'Test Window',
      component: TestWindowComponent
    });
    win.onRegister$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(service => {
        // Change window properties after it's registered...
      });
    // Don't change window properties through win.service here - explaination in HowItWorks section
  }
}
```

Your window component <b>must</b> contain windowController input!

```typescript
  windowController = input.required<NgwWindowControllerService>();
```

Also, remember to set window placement after register:

```typescript
constructor(private nwm: NgwWindowsManagerService) {
  const win = this.nwm.createWindow({
    name: 'My Window',
    component: TestCpmComponent
  });

  win.onRegister$
    .pipe(takeUntilDestroyed())
    .subscribe(service => {
      service.placementSvc.setAll(
        800,
        600,
        30,
        30
      );
    });
}
```

## HowItWorks

When you call `NgwWindowsManagerService.createWindow`
function adds default properties, ID and onRegister$ Subject
to window object and pushes it to `activeWindows`.
After pushed, it's rendered inside `NgwWindowsContainerComponent`
as `NgwWindowComponent` that calls `NgwWindowsManagerService.register`
after initialization of its service and self.
`onRegister$: Subject<NgwWindowControllerService>` was called after registration
which means that you can use all properties and services inside `NgwWindowComponent`.

# Examples

## Simple window

`src/app/app.component` - creating window after init

`src/app/test-app` - window contents

## Window with close confirmation dialog

`src/app/app.component` - add button

`src/app/close-confirm-dialog-example` - primary window with close confirmation checkbox

`src/app/close-confirm-dialog` - close confirmation dialog that fires close/cancel event to parent

# API

## NgwWindowsManagerService

<table>
  <caption>
    <b>Properties</b>
  </caption>
  <tr>
    <th>Property</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>activeWindows</td>
    <td>
      <code>WritableSignal&lt;ActiveNgwWindowProps[]&gt;</code>
    </td>
    <td>
      Full windows list.
    </td>
  </tr>
  <tr>
    <td>currentActiveWindow</td>
    <td>
      <code>WritableSignal&lt;ActiveNgwWindowProps | undefined&gt;</code>
    </td>
    <td>
      Currently active window object. If all windows are not active then it's undefined.
    </td>
  </tr>
  <tr>
    <td>onPlacementChange$</td>
    <td>
      <code>BehaviorSubject&lt;NgwWindowPlacement | undefined&gt;</code>
    </td>
    <td>
      Window placement information while moving - for preview of window placement while user moves window.
    </td>
  </tr>
</table>

> [!WARNING]
> Functions that update window properties, add window or remove window uses write operations.
> If you want to use these functions in effect then you need to set effect property {allowWriteSignals: true}.

<table>
  <caption>
    <b>Functions</b>
  </caption>
  <tr>
    <th>Function</th>
    <th>Arguments</th>
    <th>Returns</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>createWindow</td>
    <td>
      <code>properties: NgwWindowPropsWithoutId</code>,
      <code>activate?: boolean</code>
    </td>
    <td>
      <code>ActiveNgwWindowProps</code>
    </td>
    <td>Creates window instance with all properties. Window is not fully initialized yet.</td>
  </tr>
  <tr>
    <td>removeWindow</td>
    <td>
      <code>windowId: string</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>Removes window.</td>
  </tr>
  <tr>
    <td>filterWindowsByName</td>
    <td>
      <code>nameFilter?: string</code>
    </td>
    <td>
      <code>NgwWindowPropsWithService[]</code>
    </td>
    <td>Find windows that name contains specified nameFilter.</td>
  </tr>
  <tr>
    <td>getWindowById</td>
    <td>
      <code>windowId: string</code>
    </td>
    <td>
      <code>NgwWindowPropsWithService | undefined</code>
    </td>
    <td>Get window by its ID. If there's no such window then return undefined.</td>
  </tr>
  <tr>
    <td>getOpenWindows</td>
    <td>
      <code>none</code>
    </td>
    <td>
      <code>NgwWindowPropsWithService[]</code>
    </td>
    <td>Get all not minimized windows.</td>
  </tr>
  <tr>
    <td>getMaximizedWindows</td>
    <td>
      <code>none</code>
    </td>
    <td>
      <code>NgwWindowPropsWithService[]</code>
    </td>
    <td>Get all maximized windows.</td>
  </tr>
  <tr>
    <td>getMinimizedWindows</td>
    <td>
      <code>none</code>
    </td>
    <td>
      <code>NgwWindowPropsWithService[]</code>
    </td>
    <td>Get all minimized windows.</td>
  </tr>
  <tr>
    <td>getActiveWindow</td>
    <td>
      <code>none</code>
    </td>
    <td>
      <code>NgwWindowPropsWithService | undefined</code>
    </td>
    <td>Get current active window or undefined if there's no focused window.</td>
  </tr>
  <tr>
    <td>activateWindow</td>
    <td>
      <code>windowId: string</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>Activate (focus) window. If there's focused window then it will be deactivated. If window that you're activating is minimized, then it will open it.</td>
  </tr>
  <tr>
    <td>deactivateCurrentActiveWindow</td>
    <td>
      <code>none</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>Deactivate (unfocus) window.</td>
  </tr>
  <tr>
    <td>removeAllWindows</td>
    <td>
      <code>none</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>Instantly removes all active window. If some windows has close confirmation, then it will be skipped.</td>
  </tr>
  <tr>
    <td>onPlacementPrediction</td>
    <td>
      <code>placement?: NgwWindowPlacement</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>Window calls this function when user moves it and placement prediction is enabled.</td>
  </tr>
  <tr>
    <td>registerWindow</td>
    <td>
      <code>id: string</code>,
      <code>service: NgwWindowControllerService</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>Window calls this function after it's initialized. This function also calls ActiveNgwWindowProps.onRegister$ and completes it.</td>
  </tr>
</table>

## NgwWindowControllerService

Each window has its own instance of NgwWindowControllerService that can be accessed
via `NgwWindowsManagerService.createWindow(...).onRegister$`
or `NgwWindowsManagerService.findFN.service` (after initialization).
It's also passed to window app component as
required input `windowController: InputSignal<NgwWindowControllerService>`.

<table>
  <caption>
    <b>Properties</b>
  </caption>
  <tr>
    <th>Property</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>properties</td>
    <td>
      <code>WritableSignal&lt;NgwWindowProps | undefined&gt;</code>
    </td>
    <td>
      Window properties.
    </td>
  </tr>
  <tr>
    <td>onMenu$</td>
    <td>
      <code>Subject&lt;MouseEvent&gt;</code>
    </td>
    <td>
      Menu button click Subject.
    </td>
  </tr>
  <tr>
    <td>onClose$</td>
    <td>
      <code>Subject&lt;MouseEvent&gt;</code>
    </td>
    <td>
      Window Close Subject.
    </td>
  </tr>
  <tr>
    <td>leftControlsTemplate</td>
    <td>
      <code>TemplateRef&lt;any&gt;</code>
    </td>
    <td>
      Window topbar left controls template (optional).
    </td>
  </tr>
  <tr>
    <td>rightControlsTemplate</td>
    <td>
      <code>TemplateRef&lt;any&gt;</code>
    </td>
    <td>
      Window topbar right controls template (optional).
    </td>
  </tr>
  <tr>
    <td>windowNameTemplate</td>
    <td>
      <code>TemplateRef&lt;any&gt;</code>
    </td>
    <td>
      Window topbar name template (optional).
    </td>
  </tr>
  <tr>
    <td>id</td>
    <td>
      <code>Signal&lt;string&gt;</code>
    </td>
    <td>
      Read-only window id.
    </td>
  </tr>
  <tr>
    <td>name</td>
    <td>
      <code>Signal&lt;string&gt;</code>
    </td>
    <td>
      Read-only window name.
    </td>
  </tr>
  <tr>
    <td>component</td>
    <td>
      <code>Signal&lt;string&gt;</code>
    </td>
    <td>
      Read-only window component (app).
    </td>
  </tr>
  <tr>
    <td>data</td>
    <td>
      <code>WriteableSignal&lt;any&gt;</code>
    </td>
    <td>
      Read-only window data (any data passed to window via properties).
    </td>
  </tr>
</table>

> [!WARNING]
> Functions that update window properties, add window or remove window uses write operations.
> If you want to use these functions in effect then you need to set effect property {allowWriteSignals: true}.

<table>
  <caption>
    <b>Functions</b>
  </caption>
  <tr>
    <th>Function</th>
    <th>Arguments</th>
    <th>Returns</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>moveWindow</td>
    <td>
      <code>x: number</code>,
      <code>y: number</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>Moves window with checking max/min position to user viewport. Checks minimized and maximized state, if some of them is true, then cancels execution.</td>
  </tr>
  <tr>
    <td>resizeWindow</td>
    <td>
      <code>width: number</code>,
      <code>height: number</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>Resize window, uses window mix and max size. Cancels if window is minimized or maximized.</td>
  </tr>
  <tr>
    <td>doNgwWindowPlacementIfPossible</td>
    <td>
      <code>x: number</code>,
      <code>y: number</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>Checks possible window placement mode and if it's not "free", then applies this placement to window.</td>
  </tr>
  <tr>
    <td>getPlacementMode</td>
    <td>
      <code>x: number</code>,
      <code>y: number</code>
    </td>
    <td>
      <code>WindowPlacementKeyName | undefined</code>
    </td>
    <td>Predicts window placement mode or undefined if it's "free".</td>
  </tr>
  <tr>
    <td>isOverResizingPoint</td>
    <td>
      <code>x: number</code>,
      <code>y: number</code>
    </td>
    <td>
      <code>boolean</code>
    </td>
    <td>Checks distance to window resizing point and returns if mouse cursor is over this point.</td>
  </tr>
  <tr>
    <td>minimize</td>
    <td>
      <code>none</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>Sets window minimized state. If current active window is focused (active), then deactivates it.</td>
  </tr>
  <tr>
    <td>toggleMaximize</td>
    <td>
      <code>none</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>Toggles window maximized state.</td>
  </tr>
  <tr>
    <td>setLocked</td>
    <td>
      <code>locked: boolean</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>Sets window locked state.</td>
  </tr>
  <tr>
    <td>close</td>
    <td>
      <code>ev: MouseEvent</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>If window has preventClose option then emits onClose$ Subject, else calls removeWindow.</td>
  </tr>
</table>

# NgwWindowConfigurationService

Provided in and used by NgwWindowComponent.

<table>
  <caption>
    <b>Properties</b>
  </caption>
  <tr>
    <th>Property</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>displayProperties</td>
    <td>
      <code>WritableSignal&lt;NgwWindowConfiguration&gt;</code>
    </td>
    <td>
      All window display properties.
    </td>
  </tr>
  <tr>
    <td>displayName</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Display window name in topbar.
    </td>
  </tr>
  <tr>
    <td>showLeftControls</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Show window left controls, by default - menu button.
    </td>
  </tr>
  <tr>
    <td>showRightControls</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Show window right controls, by default - minimize, maximize, close.
    </td>
  </tr>
  <tr>
    <td>showMenuButton</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Show window menu button which emits onMenu$ on click.
    </td>
  </tr>
  <tr>
    <td>maximizable</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Sets if window can be maximized.
    </td>
  </tr>
  <tr>
    <td>minimizable</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Sets if window can be minimized.
    </td>
  </tr>
  <tr>
    <td>closeable</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Sets if window can be closed by user.
    </td>
  </tr>
  <tr>
    <td>preventClose</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Sets close prevention by user. You can use onClose$ to show close confirmation dialog and then use removeWindow.
    </td>
  </tr>
  <tr>
    <td>showTopBar</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Sets if window topbar could be shown. Without it you need to manually manage window state, close and move.
    </td>
  </tr>
  <tr>
    <td>placementDistanceTolerance</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Tolerance of placement prediction & alignment (distance from placement point).
    </td>
  </tr>
  <tr>
    <td>resizeDistanceTolerance</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Distance to window resize point for resize activation (right bottom corner).
    </td>
  </tr>
  <tr>
    <td>allowOutboundMovements</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Sets if window could be moved outside user viewport.
    </td>
  </tr>
  <tr>
    <td>allowPlacementAlignment</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Sets if window could be aligned to placement point.
    </td>
  </tr>
  <tr>
    <td>borderless</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Disables window border.
    </td>
  </tr>
  <tr>
    <td>noShadow</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Disabled window shadow.
    </td>
  </tr>
  <tr>
    <td>transparent</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Sets if window should be transparent.
    </td>
  </tr>
  <tr>
    <td>background</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Sets css window background (if not transparent).
    </td>
  </tr>
  <tr>
    <td>backdropFilter</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Sets css backdrop filter.
    </td>
  </tr>
  <tr>
    <td>moveable</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Sets if window could be moveable.
    </td>
  </tr>
  <tr>
    <td>resizeable</td>
    <td>
      <code>Signal&lt;boolean&gt;</code>
    </td>
    <td>
      Sets if window could be resizeable.
    </td>
  </tr>
</table>

<table>
  <caption>
    <b>Functions</b>
  </caption>
  <tr>
    <th>Function</th>
    <th>Arguments</th>
    <th>Returns</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>setProperty</td>
    <td>
      <code>property: T</code>,
      <code>value: NgwWindowConfiguration[T]</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>
      Sets specific property defined in NgwWindowConfiguration.
    </td>
  </tr>
  <tr>
    <td>setProperties</td>
    <td>
      <code>properties: NgwWindowConfiguration</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>
      Overrides all window configuration properties.
    </td>
  </tr>
  <tr>
    <td>appendProperties</td>
    <td>
      <code>properties: Partial&lt;NgwWindowConfiguration&gt;</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>
      Concat new properties with previous.
    </td>
  </tr>
</table>

# NgwWindowPlacementService

Provided in and used by NgwWindowComponent.

<table>
  <caption>
    <b>Properties</b>
  </caption>
  <tr>
    <th>Property</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>placementMode</td>
    <td>
      <code>WritableSignal&lt;WindowPlacementsKeyName | undefined&gt;</code>
    </td>
    <td>
      Current window placement mode.
    </td>
  </tr>
  <tr>
    <td>placementBeforeAuto</td>
    <td>
      <code>WritableSignal&lt;NgwWindowPlacement | undefined&gt;</code>
    </td>
    <td>
      Window placement before alignment.
    </td>
  </tr>
  <tr>
    <td>width</td>
    <td>
      <code>WritableSignal&lt;number&gt;</code>
    </td>
    <td>
      Window width.
    </td>
  </tr>
  <tr>
    <td>height</td>
    <td>
      <code>WritableSignal&lt;number&gt;</code>
    </td>
    <td>
      Window height.
    </td>
  </tr>
  <tr>
    <td>offsetX</td>
    <td>
      <code>WritableSignal&lt;number&gt;</code>
    </td>
    <td>
      Window X position.
    </td>
  </tr>
  <tr>
    <td>offsetY</td>
    <td>
      <code>WritableSignal&lt;number&gt;</code>
    </td>
    <td>
      Window Y position.
    </td>
  </tr>
  <tr>
    <td>minWidth</td>
    <td>
      <code>WritableSignal&lt;number&gt;</code>
    </td>
    <td>
      Window minimum width.
    </td>
  </tr>
  <tr>
    <td>maxWidth</td>
    <td>
      <code>WritableSignal&lt;number&gt;</code>
    </td>
    <td>
      Window maximum width.
    </td>
  </tr>
  <tr>
    <td>minHeight</td>
    <td>
      <code>WritableSignal&lt;number&gt;</code>
    </td>
    <td>
      Window minimum height.
    </td>
  </tr>
  <tr>
    <td>maxHeight</td>
    <td>
      <code>WritableSignal&lt;number&gt;</code>
    </td>
    <td>
      Window maximum height.
    </td>
  </tr>
</table>

<table>
  <caption>
    <b>Functions</b>
  </caption>
  <tr>
    <th>Function</th>
    <th>Arguments</th>
    <th>Returns</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>setWH</td>
    <td>
      <code>width: number</code>,
      <code>height: number</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>
      Sets window width and height.
    </td>
  </tr>
  <tr>
    <td>setOffset</td>
    <td>
      <code>offsetX: number</code>,
      <code>offsetY: number</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>
      Set window XY position.
    </td>
  </tr>
  <tr>
    <td>setAll</td>
    <td>
      <code>width: number</code>,
      <code>height: number</code>,
      <code>offsetX: number</code>,
      <code>offsetY: number</code>
    </td>
    <td>
      <code>void</code>
    </td>
    <td>
      Sets all window placement properties.
    </td>
  </tr>
  <tr>
    <td>getPlacementObject</td>
    <td>
      <code>none</code>
    </td>
    <td>
      <code>NgwWindowPlacement</code>
    </td>
    <td>
      Current window placement object.
    </td>
  </tr>
</table>

# NgwWindowStateService

Provided in and used by NgwWindowComponent.

<table>
  <caption>
    <b>Properties</b>
  </caption>
  <tr>
    <th>Property</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>minimized</td>
    <td>
      <code>WritableSignal&lt;boolean&gt;</code>
    </td>
    <td>
      Window minimized state signal.
    </td>
  </tr>
  <tr>
    <td>maximized</td>
    <td>
      <code>WritableSignal&lt;boolean&gt;</code>
    </td>
    <td>
      Window maximized state signal.
    </td>
  </tr>
  <tr>
    <td>focused</td>
    <td>
      <code>WritableSignal&lt;boolean&gt;</code>
    </td>
    <td>
      Window focused state signal.
    </td>
  </tr>
  <tr>
    <td>locked</td>
    <td>
      <code>WritableSignal&lt;boolean&gt;</code>
    </td>
    <td>
      Window locked state signal.
    </td>
  </tr>
</table>

# Styling

You can create custom scss file with styles and import it in your styles.scss file.
Example file can be found in public/custom-window-style.scss file.

Default style:
```scss
ngw-window {
  &:not(.transparent) {
    background: #efefef !important;
  }

  &:not(&.borderless) {
    border: solid 1px #373737;
  }

  &:not(&.noshadow) {
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.1);
  }

  &.focused:not(&.noshadow) {
    box-shadow: 1px 1px 6px rgba(0, 0, 0, .35),
    1px 1px 4px rgba(0, 0, 0, .2);
  }

  .ngw-window-topbar {
    background: #373737;
    color: #fff;
  }

  ngw-icon:hover {
    background-color: rgba(255, 255, 255, .15);
  }

  .ngw-window-content {
    color: #000;
    padding: 0;
  }
}

ngw-windows-container .ngw-window-placement-prediction.show {
  background-color: rgba(150, 200, 255, .5);
  border: solid 2px rgba(150, 200, 255, .95);
  backdrop-filter: blur(1px);
}

ngw-icon svg path {
  fill: #fff;
  stroke: #fff;
}
```

# Testing

Running tests: `npm run test-ngx-windows`.

<table>
  <caption>
    Test coverage
  </caption>
  <tr>
    <th>Class</th>
    <th>Has tests</th>
    <th>Comments</th>
  </tr>
  <tr>
    <td>NgwWindowsManagerService</td>
    <td>
      ☑️
    </td>
    <td>
      Missing tests for <code>onPlacementPrediction</code> and <code>registerWindow</code>
    </td>
  </tr>
  <tr>
    <td>NgwWindowComponent</td>
    <td>
      ✅
    </td>
    <td>Full</td>
  </tr>
  <tr>
    <td>NgwWindowStateService</td>
    <td>
      ✅
    </td>
    <td>Full</td>
  </tr>
  <tr>
    <td>NgwWindowPlacementService</td>
    <td>
      ✅
    </td>
    <td>Full</td>
  </tr>
  <tr>
    <td>NgwWindowControllerService</td>
    <td>
      ✅
    </td>
    <td>Full</td>
  </tr>
  <tr>
    <td>NgwWindowConfigurationService</td>
    <td>
      ✅
    </td>
    <td>Full</td>
  </tr>
  <tr>
    <td>IconComponent</td>
    <td>
      ✅
    </td>
    <td>Full</td>
  </tr>
</table>`
