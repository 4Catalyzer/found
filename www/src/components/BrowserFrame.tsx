import useAnimationFrame from '@restart/hooks/useAnimationFrame';
import useEventListener from '@restart/hooks/useEventListener';
import clsx from 'clsx';
import React from 'react';

import Iframe from './Iframe';
import styles from './BrowserFrame.module.css';

const getWindow = () => window;

function BrowserFrame({
  children,
  resizable = false,
  ...props
}: React.ComponentPropsWithoutRef<'iframe'> & { resizable?: boolean }) {
  const animationFrame = useAnimationFrame();
  const maxXRef = React.useRef(Infinity);
  const [loaded, setLoaded] = React.useState(false);
  const [width, setWidth] = React.useState<any>('100%');
  const ref = React.useRef<HTMLDivElement>(null);

  const pointerRef = React.useRef<{ x: null | number; start: null | number }>({
    x: null,
    start: null,
  });

  const scaleFactor = 0.75;

  useEventListener(
    getWindow,
    'resize',
    () => {
      animationFrame.request(() => {
        maxXRef.current = Infinity;
        setWidth('100%');
      });
    },
    { passive: true },
  );

  return (
    <div className={styles.container} ref={ref} style={{ width }}>
      <div className={styles.chrome}>
        {/* <ArrowLeft className="h-4 w-4 text-grey-70 flex-shrink-0" />
        <ArrowRight className="h-4 w-4 text-grey-70 flex-shrink-0" /> */}
        <div className={styles.url} />
      </div>
      <div
        className={clsx(
          'border-4 border-grey-80 relative',
          resizable && 'border-r-8',
        )}
        style={{ height: 400 }}
      >
        <Iframe
          className="origin-top-left"
          onLoad={() => setLoaded(true)}
          style={{
            transform: `scale(${scaleFactor})`,
            width: `${(1 / scaleFactor) * 100}%`,
            height: `${(1 / scaleFactor) * 100}%`,
          }}
          {...props}
        >
          {children}
        </Iframe>
        {!loaded && (
          <>
            <div className="absolute -inset-px bg-black z-10" />
            <div className="absolute -inset-px bg-grey-90 animate-pulse z-10" />
          </>
        )}
      </div>
      {resizable && (
        <div
          onPointerDown={(e) => {
            if (!Number.isFinite(maxXRef.current)) {
              maxXRef.current = e.clientX;
            }

            pointerRef.current = {
              x: e.clientX,
              start: ref.current!.offsetWidth,
            };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerUp={(e) => {
            pointerRef.current = {
              x: null,
              start: null,
            };
            e.currentTarget.releasePointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (pointerRef.current.start == null) return;

            const x =
              Math.min(e.clientX, maxXRef.current) - pointerRef.current!.x!;

            animationFrame.request(() =>
              setWidth(`${Math.max(pointerRef.current.start! + x, 200)}px`),
            );
          }}
          className="absolute flex items-center top-0 bottom-0 right-0 w-2 z-10 cursor-move"
        >
          {/* <DragHandles className="h-6 w-2" /> */}
        </div>
      )}
    </div>
  );
}

export default BrowserFrame;
