// CountUp.jsx
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

export default function CountUp({ end, duration = 2, delay = 0 }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true })
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true

    const timer = setTimeout(() => {
      const steps = 60
      const increment = end / steps
      let current = 0
      const interval = setInterval(() => {
        current += increment
        if (current >= end) {
          setCount(end)
          clearInterval(interval)
        } else {
          setCount(Math.floor(current))
        }
      }, (duration * 1000) / steps)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [inView, end, duration, delay])

  return <span ref={ref}>{count.toLocaleString()}</span>
}
