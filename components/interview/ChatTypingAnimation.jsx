// components/interview/ChatTypingAnimation.jsx
export default function ChatTypingAnimation() {
    return (
      <div className="flex items-center space-x-2 mt-2">
        <div className="typing-animation">
          <svg width="50" height="30" viewBox="0 0 50 30" className="text-orange-500">
            <circle cx="10" cy="15" r="4" fill="currentColor">
              <animate 
                attributeName="opacity" 
                from="0.3" 
                to="1" 
                dur="0.8s" 
                begin="0s" 
                repeatCount="indefinite" 
                keyTimes="0;0.5;1" 
                values="0.3;1;0.3" 
              />
            </circle>
            <circle cx="25" cy="15" r="4" fill="currentColor">
              <animate 
                attributeName="opacity" 
                from="0.3" 
                to="1" 
                dur="0.8s" 
                begin="0.15s" 
                repeatCount="indefinite" 
                keyTimes="0;0.5;1" 
                values="0.3;1;0.3" 
              />
            </circle>
            <circle cx="40" cy="15" r="4" fill="currentColor">
              <animate 
                attributeName="opacity" 
                from="0.3" 
                to="1" 
                dur="0.8s" 
                begin="0.3s" 
                repeatCount="indefinite" 
                keyTimes="0;0.5;1" 
                values="0.3;1;0.3" 
              />
            </circle>
          </svg>
        </div>
      </div>
    );
  }
  