import { defer, of, fromEvent, concat, Subject } from 'rxjs';
import { tap, mergeMap, repeat, takeWhile, delay, exhaustMap, map, takeUntil } from 'rxjs/operators';
import AnimationService from './animation.service';
import { ElementTransform } from './element-transform';

export class AnimatedElement {
  transform = new ElementTransform();
  mouseDown$ = fromEvent(this.elem, 'mousedown');

  constructor(public htmlElement: HTMLElement) { }

  get elem() {
    return this.htmlElement;
  }

  get x() {
    return this.htmlElement.getBoundingClientRect().left;
  }

  get y() {
    return this.htmlElement.getBoundingClientRect().top;
  }

  get width() {
    return this.htmlElement.clientWidth;
  }

  set moveX(x: number) {
    this.htmlElement.style.left = `${x}px`;
  }

  set moveY(y: number) {
    this.htmlElement.style.top = `${y}px`;
  }

  set moveZ(z: number) {
    this.transform.moveZ = z;
    this.htmlElement.style.transform = this.transform.toString();
  }

  set rotate(deg: number) {
    this.transform.rotate = deg;
    this.htmlElement.style.transform = this.transform.toString();
  }

  twist$ = (indeterminate = true, rotations = 1, clockwise = true) =>
    defer(() => {
      let counter = 0;
      return AnimationService.twist(clockwise).pipe(
        tap(
          (x) => this.rotate = x,
          () => { },
          () => counter++
        ),
        repeat(),
        takeWhile((x) => indeterminate || counter < rotations)
      );
    })

  jump$ = (indeterminate = true, iterations = 1, clockwise = true) =>
    defer(() => {
      let counter = 0;
      return AnimationService.tween(0, 30, 300).pipe(
        tap(x => this.moveZ),
        tap(
          (x) => this.moveZ = x,
          () => { },
          () => { 
            this.moveZ = 0;
            counter++;
          }
        ),
        repeat(),
        takeWhile((x) => indeterminate || counter < iterations)
      );
    })

  dragAndDrop$ = () => {
    const mouseMove$ = fromEvent(document, 'mousemove');
    const mouseUp$ = fromEvent(document, 'mouseup');

    return this.mouseDown$.pipe(
      exhaustMap((mouseDown: MouseEvent) =>
        concat(
          mouseMove$.pipe(
            map((mouseMove: MouseEvent) => mouseMove.clientX - mouseDown.offsetX),
            takeUntil(mouseUp$),
          ),
          this.move$,
          this.enter$
        )
      ),
      tap((x: number) => this.moveX = x)
    );
  }

  move$ = defer(() => {
    const t = 200;
    let x1 = this.x;

    if (this.x < (-this.width / 2)) {
      x1 = -(window.innerWidth + this.width);
    } else if (this.x > (window.innerWidth - (this.width / 2))) {
      x1 = window.innerWidth + this.width;
    } else {
      return this.center$;
    }

    return AnimationService.tween(this.x, x1, t).pipe(tap(x => this.moveX = x));
  });

  center$ = defer(() => {
    const t = 200;
    const x1 = (window.innerWidth / 2) - (this.width / 2);
    return AnimationService.tween(this.x, x1, t).pipe(
      tap(x => this.moveX = x)
    );
  });

  enter$ = defer(() => {
    if (this.x < 0) {
      return this.enterRight$;
    } else if (this.x > window.innerWidth) {
      return this.enterLeft$;
    } else {
      return of(false);
    }
  });

  enterLeft$ = defer(() => {
    const x0 = -this.width;
    const x1 = (window.innerWidth / 2) - (this.width / 2);
    const t = 400;
    return AnimationService.tween(x0, x1, t);
  }).pipe(tap(x => this.moveX = x));

  enterRight$ = defer(() => {
    const x0 = window.innerWidth + this.width;
    const x1 = (window.innerWidth / 2) - (this.width / 2);
    const t = 400;
    return AnimationService.tween(x0, x1, t);
  }).pipe(tap(x => this.moveX = x));
}