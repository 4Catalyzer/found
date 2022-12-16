import { useEventCallback } from '@restart/hooks';
import { Modal, ModalProps } from '@restart/ui';
import React, { ReactNode } from 'react';
import { cloneElement, useEffect, useRef } from 'react';

function fade(element: HTMLElement, show: boolean) {
  const animation = element.animate(
    { opacity: [0, 1] },
    { duration: 300, fill: 'forwards' },
  );

  if (!show) {
    animation.reverse();
  }

  return animation;
}

function fadeAndSlide(element: HTMLElement, show: boolean) {
  const animation = element.animate(
    {
      opacity: [0, 1],
      transform: ['translateX(50%)', 'translateX(0)'],
    },
    { duration: 300, easing: 'ease-in-out', fill: 'forwards' },
  );

  if (!show) {
    animation.reverse();
  }

  return animation;
}

function createTransition(
  run: (element: HTMLElement, show: boolean) => Animation,
) {
  function Transition({ children, in: show, onExited, onEntered }: any) {
    const ref = useRef<HTMLElement>(null);

    const onFinish = useEventCallback((show) => {
      if (show) onEntered?.();
      else onExited?.();
    });

    // This is hacky, but it ensures that the animation plays on exit
    // by appending the now detatched element to its parent after it unmounted
    // in order to animate it out
    useEffect(() => {
      const element = ref.current!;
      const parentElement = element.parentElement;
      return () => {
        let clone = element.cloneNode(true) as HTMLElement;
        parentElement!.append(clone);
        run(clone, false).finished.then(() => {
          clone.remove();
        });
      };
    }, []);

    useEffect(() => {
      const element = ref.current!;
      run(element, show).finished.then(() => {
        onFinish(show);
      });
    }, [show, onFinish]);

    return cloneElement(children, { ref });
  }

  return Transition;
}

const BackdropTransition = createTransition(fade);
const DialogTransition = createTransition(fadeAndSlide);

export function Drawer({
  children,
  ...props
}: {
  show: boolean;
  onHide: () => void;
  children?: ReactNode;
}) {
  return (
    <Modal
      {...props}
      transition={DialogTransition}
      backdropTransition={BackdropTransition}
      renderBackdrop={(backdropProps) => (
        <div
          {...backdropProps}
          className="fixed z-50 bg-black/50 inset-0 opacity-0"
        />
      )}
      renderDialog={(dialogProps) => (
        <div
          {...dialogProps}
          className="fixed z-50 shadow right-0 inset-y-0 translate-x-1/2 max-w-screen-sm w-full bg-white p-6"
        >
          {children}
        </div>
      )}
    />
  );
}
