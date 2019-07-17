import { interval, animationFrameScheduler, defer, of } from 'rxjs';
import { map, tap, takeWhile, concat } from 'rxjs/operators';

class AnimationService {
  frames$ = interval(0, animationFrameScheduler);

  ticks$ = defer(() => {
    const start = animationFrameScheduler.now();
    return this.frames$.pipe(
      map(() => animationFrameScheduler.now() - start),
    );
  });
  
  duration(ms: number) {
    return this.ticks$.pipe(
      map(t => t / ms),
      takeWhile(t => t <= 1),
    ) 
  }

  tween(start: number, end: number, duration: number) {
    const difference = end - start;
    return this.duration(duration).pipe(
      map(d => Math.round(start + (d * difference)))
    );
  }

  twist(clockwise = true) {
    const x0 = clockwise ? 0 : 360;
    const x1 = clockwise ? 360 : 0;
    return this.tween(x0, x1, 2000);
  }
}

export default new AnimationService();