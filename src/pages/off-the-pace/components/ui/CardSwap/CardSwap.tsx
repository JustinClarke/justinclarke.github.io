/**
 * CardSwap a 3D stack of cards that auto-cycles: the front card drops away and
 * the rest promote forward on a timer, GSAP driving the motion. Click a back
 * card to bring it forward, or the front card to advance.
 *
 * Fits in: a presentational widget used in Off The Pace overview sections to
 *          show a rotating deck of cards. You give it <Card> children.
 * Note:    Animation is done imperatively with GSAP on real DOM nodes (via
 *          refs), not React state - React renders the cards once, GSAP moves
 *          them. That is why almost everything here lives in refs, not useState.
 *
 * For beginners ----------------------------------------------------------------
 * - forwardRef lets a parent grab the real <div> inside <Card> so GSAP can
 *   animate it; a normal component can't be handed a ref.
 * - useRef holds values that must persist between renders without causing a
 *   re-render (the GSAP timeline, the interval id, the current card order).
 * - cloneElement copies each child and injects extra props (a ref, sizing, a
 *   click handler) without the caller having to wire them up.
 * -----------------------------------------------------------------------------
 */
import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

// LEARN: forwardRef = "let my parent reach the DOM node inside me." The ref the
//    parent passes is attached to this <div>, so CardSwap/GSAP can move it.
export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

// LEARN: makeSlot computes where card #i sits in the 3D stack - shifted right
//    (x), up (y), back (z), and layered (zIndex) so nearer cards cover farther.

const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: ReturnType<typeof makeSlot>, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  resumeDelayAfterHoverEnd?: number;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
}

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  resumeDelayAfterHoverEnd = 6000,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  children
}: CardSwapProps) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'back.out(1.4)',
          durDrop: 0.7,
          durMove: 0.7,
          durReturn: 0.7,
          promoteOverlap: 0.6,
          returnDelay: 0.1
        }
      : {
          ease: 'power3.inOut',
          durDrop: 0.6,
          durMove: 0.6,
          durReturn: 0.6,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        };

  // LEARN: useMemo caches a computed value so it is not rebuilt on every render
  //    unless its inputs change. Here it keeps a stable array of children and a
  //    matching array of refs (one DOM handle per card) tied to the card count.
  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  // LEARN: `order` is the current front-to-back sequence of card indices. It
  //    lives in a ref because the animation mutates it constantly and we do NOT
  //    want a React re-render each time - GSAP, not React, owns the visuals.
  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | undefined>(undefined);
  const container = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const handleCardClickRef = useRef<((idx: number) => void) | null>(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => {
      if (r.current) placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
    });

    // LEARN: one "swap" = the front card drops, everyone behind slides forward
    //    one slot, and the dropped card flies to the back. Each step is added to
    //    a GSAP timeline with labels (promote/return) so the moves overlap nicely.
    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      if (!elFront) return;
      
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    const startInterval = () => {
      clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(swap, delay);
    };

    const handleCardClick = (clickedIdx: number) => {
      tlRef.current?.kill();
      clearInterval(intervalRef.current);

      const pos = order.current.indexOf(clickedIdx);
      if (pos === -1) return;

      if (pos === 0) {
        // Clicked the front card -> swap it to the back (next)
        swap();
        startInterval();
      } else {
        // Clicked a card behind -> bring it to the front
        const newOrder = [
          ...order.current.slice(pos),
          ...order.current.slice(0, pos)
        ];

        const tl = gsap.timeline();
        tlRef.current = tl;

        newOrder.forEach((idx, newPos) => {
          const el = refs[idx].current;
          if (!el) return;
          const slot = makeSlot(newPos, cardDistance, verticalDistance, refs.length);
          
          tl.set(el, { zIndex: slot.zIndex }, 0);
          tl.to(
            el,
            {
              x: slot.x,
              y: slot.y,
              z: slot.z,
              duration: config.durMove,
              ease: config.ease
            },
            0
          );
        });

        order.current = newOrder;
        tl.call(() => startInterval());
      }
    };
    handleCardClickRef.current = handleCardClick;

    swap();
    startInterval();

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, skewAmount, easing]);

  // LEARN: clone each child card to inject the props it needs to participate:
  //    a ref (so GSAP can grab its node), a width/height, and a click handler
  //    that still calls the card's own onClick first, then advances the deck.
  const rendered = childArr.map((child, i) => {
    if (isValidElement(child)) {
      const element = child as React.ReactElement<any>;
      return cloneElement(element, {
        key: i,
        ref: refs[i],
        style: { width, height, ...(element.props.style ?? {}) },
        onClick: (e: any) => {
          element.props.onClick?.(e);
          onCardClick?.(i);
          handleCardClickRef.current?.(i);
        }
      });
    }
    return child;
  });

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;
