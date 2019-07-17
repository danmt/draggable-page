// Import stylesheets
import './style.css';
import { merge } from 'rxjs';
import { startWith, mergeMap } from 'rxjs/operators';
import AnimationService from './animation.service';
import { AnimatedElement } from './animated-element';

function runApp() {
  const skullDiv: HTMLElement = document.getElementById('skull');
  const pageDiv: HTMLElement = document.getElementById('page');

  const page = new AnimatedElement(pageDiv);
  const skull = new AnimatedElement(skullDiv);

  page.moveX = (window.innerWidth / 2) - 200;

  const windowResize$ = page.windowResize$.pipe(
    mergeMap(() => page.center$)
  );

  return merge(
    windowResize$,
    page.dragAndDrop$(),
    skull.twist$(),
    skull.jump$()
  );
}

runApp().subscribe();
