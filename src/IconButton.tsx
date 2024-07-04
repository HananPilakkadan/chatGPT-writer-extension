import React, { useEffect, useRef } from "react"

import Icon from "../assets/Vector.png"

const IconButton = ({ target, onIconClick }) => {
  const iconRef = useRef(null)
  useEffect(() => {
    if (target) {
      const rect = target.getBoundingClientRect()
      console.log(rect, "rect")
      iconRef.current.style.top = `${rect.bottom - 40}px`
      iconRef.current.style.left = `${rect.right - 40}px`
      iconRef.current.style.display = "block"
    } else {
      iconRef.current.style.display = "none"
    }
  }, [target])

  return (
    <div
      ref={iconRef}
      className="absolute w-12 h-12 bg-white text-white flex items-center justify-center rounded-full cursor-pointer z-50 p-3"
      style={{ display: "none" }}
      onClick={onIconClick}>
      <img
        src={Icon}
        alt="Icoin"
        // width={10}
        // height={10}
        // style={{ margin: "0 auto" }}
      />
    </div>
  )
}

export default IconButton
