import React from 'react';
import { createPortal } from 'react-dom';

function Iframe({
  children,
  onLoad,
  ...props
}: React.ComponentPropsWithoutRef<'iframe'>) {
  const [contentRef, setContentRef] = React.useState<HTMLIFrameElement | null>(
    null,
  );
  const mountNode = contentRef?.contentWindow!.document.body;

  React.useEffect(() => {
    if (!contentRef) return;

    if (
      performance
        .getEntriesByType('navigation')
        .every((e: any) => e.loadEventEnd)
    ) {
      onLoad?.(null as any);
    }

    contentRef.contentWindow!.addEventListener('load', (e: any) => {
      onLoad?.(e);
    });

    const { head } = contentRef.contentWindow!.document;

    Array.from(document.head.children).forEach((el) => {
      if (el.getAttribute('rel') === 'stylesheet')
        head.appendChild(el.cloneNode());
    });
    const reset = document.createElement('style');
    reset.textContent = `
      body {
        font-size: 1.4rem;
        line-height: 2rem;
      }
    `;
    head.appendChild(reset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentRef]);

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
      <iframe {...props} ref={setContentRef} />

      {mountNode && createPortal(children, mountNode)}
    </>
  );
}

export default Iframe;
