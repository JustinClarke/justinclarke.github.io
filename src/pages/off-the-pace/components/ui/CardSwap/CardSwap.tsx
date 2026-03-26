import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

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

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

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
