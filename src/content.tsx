import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useState } from "react"
import { render } from "react-dom"
import { IoArrowDownOutline } from "react-icons/io5"
import { MdLoop } from "react-icons/md"
import { VscSend } from "react-icons/vsc"

import { CountButton } from "~features/CountButton"
import IconButton from "~IconButton"
import Modal from "~modal"

export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  const [focusedElement, setFocusedElement] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGenerated, setIsGenarated] = useState(false)
  const [message, setMessage] = useState()
  const [sendMessage, setSendMessage] = useState()
  const [response, setResponse] = useState(
    "Thank you for the opportunity! If you have any more questions orif there's anything else I can help you with, feel free to ask."
  )

  useEffect(() => {
    const handleFocusIn = (event) => {
      const target = event.target
      console.log(target, "target")
      if (target.matches("input, textarea, [contenteditable='true']")) {
        setFocusedElement(target)
      }
    }

    const handleFocusOut = () => {
      //   setFocusedElement(null);
    }

    document.addEventListener("focusin", handleFocusIn)
    document.addEventListener("focusout", handleFocusOut)

    // Use MutationObserver to detect dynamically added input fields
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          const addedNodes = Array.from(mutation.addedNodes)
          addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement
              if (
                element.matches("input, textarea, [contenteditable='true']")
              ) {
                element.addEventListener("focusin", handleFocusIn)
                element.addEventListener("focusout", handleFocusOut)
              }
              // Also check for nested inputs
              const nestedInputs = element.querySelectorAll(
                "input, textarea, [contenteditable='true']"
              )
              nestedInputs.forEach((nestedInput) => {
                nestedInput.addEventListener("focusin", handleFocusIn)
                nestedInput.addEventListener("focusout", handleFocusOut)
              })
            }
          })
        }
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    // Clean up event listeners and observer on unmount
    return () => {
      document.removeEventListener("focusin", handleFocusIn)
      document.removeEventListener("focusout", handleFocusOut)
      observer.disconnect()
    }
  }, [])

  const handleIconClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleInsert = () => {
    console.log("Helloo", focusedElement)
    const pTag = focusedElement.querySelector("p")
    if (pTag) {
      pTag.innerText = response
    } else if (
      focusedElement.tagName.toLowerCase() === "input" ||
      focusedElement.tagName.toLowerCase() === "textarea"
    ) {
      focusedElement.value = response
    } else if (focusedElement.isContentEditable) {
      focusedElement.innerHTML = response
    }
    console.log("Inserted message:", response)
    setMessage("")
    setIsGenarated(false)
    setIsModalOpen(false)
  }

  const handleMessage = (e) => {
    setMessage(e?.target?.value)
  }

  const handleGenarate = () => {
    if (message) {
      setIsGenarated(true)
      setSendMessage(message)
      setMessage("")
    }
  }
  return (
    <>
      {focusedElement && (
        <IconButton target={focusedElement} onIconClick={handleIconClick} />
      )}
      <div className="z-50 flex fixed top-32 right-8">
        {/* <CountButton /> */}
        <Modal isOpen={isModalOpen} onClose={() => handleCloseModal()}>
          {isGenerated && (
            <div className="relative">
              <span className="translate-x-2/4 bg-slate-200 block text-xl p-3 rounded-md w-2/3 ">
                {sendMessage}
              </span>
              <span className="translate-x-0 bg-blue-100 block text-xl p-3 rounded-md w-2/3 my-2">
                {response}
              </span>
            </div>
          )}
          <div>
            <input
              type="text"
              placeholder="Your Prompt"
              className="p-2 w-full max-w-full border-2 border-slate-300 rounded-md my-2 text-xl text-neutral-500"
              onChange={(e) => handleMessage(e)}
              value={message}
            />
            <div className="flex items-center justify-end">
              {isGenerated && (
                <button
                  className="border-2 border-slate-300 rounded-md text-neutral-500 mx-2 p-3 text-xl flex items-center justify-center"
                  onClick={() => handleInsert()}>
                  <IoArrowDownOutline /> <span className="mx-1">insert</span>
                </button>
              )}
              <button
                className={`p-3 bg-blue-500 text-white text-lg rounded-md flex items-center justify-center `}
                onClick={() => handleGenarate()}>
                {isGenerated ? (
                  <>
                    <MdLoop /> <span className="mx-1">Regenerate</span>
                  </>
                ) : (
                  <>
                    <VscSend /> <span className="mx-1">Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  )
}

const root = document.createElement("div")
document.body.appendChild(root)
render(<PlasmoOverlay />, root)

export default PlasmoOverlay
