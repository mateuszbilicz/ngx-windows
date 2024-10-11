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
to window object and pushes it to `activeWindows$`.
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

... TODO: functions table: function, description

## NgwWindowControllerService

Each window has its own instance of NgwWindowControllerService that can be accessed
via `NgwWindowsManagerService.createWindow(...).onRegister$`
or `NgwWindowsManagerService.findFN.service` (after initialization).

... TODO: functions table: function, description

# Styling

... TODO: about css, theming, etc...

# Testing

No test were written in current version.
... TODO

# TODO

- [ ] Search for unused imports after rewrite of services and fix them
- [ ] Add example bar with active&minimized windows
- [ ] Readme API NgwWindowControllerService section - info about child services and its subjects
  that can be used to handle placement, state and config changes
- [ ] Create some example layout inside TestAppComponent
- [ ] Add example with lazy-loading and loading screen on window
- [ ] Write tests
- [ ] Complete README.md
- [ ] Make `projects/ngx-windows` separated library for easy installation and minimal package size
