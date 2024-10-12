# Angular Windows

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.6.

Previous versions of Angular aren't supported.

### Version

<b>1.0.0 - EARLY PREVIEW</b>

I do not recommend using current version in commercial projects.

### License

This project is under ISC license.

# Using Angular Windows

## Installation

... TODO

## Usage

1. You should provide NgwWindowsManagerService in app config
   or if you need multiple instances - in specific component that will
   contain windows.

2. Add NgwWindowsContainerComponent to your template

```angular17html

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
      Full windows list
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


<table>
  <caption>
    <b>Properties</b>
  </caption>
  <tr>
    <th>Property</th>
    <th>Type</th>
    <th>Description</th>
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
    <td></td>
    <td>
      <code></code>
    </td>
    <td>
      <code></code>
    </td>
    <td></td>
  </tr>
</table>

... TODO: functions table: function, description

# Styling

... TODO: about css, theming, etc...

# Testing

No test were written in current version.
... TODO

# TODO

- [X] Search for unused imports after rewrite of services and fix them
- [X] Add example bar with active&minimized windows
- [ ] Readme API NgwWindowControllerService section - info about child services and its subjects
  that can be used to handle placement, state and config changes
- [ ] Create some example layout inside TestAppComponent
- [ ] Add example with lazy-loading and loading screen on window
- [ ] Write tests
- [ ] Complete README.md
- [ ] Make `projects/ngx-windows` separated library for easy installation and minimal package size
