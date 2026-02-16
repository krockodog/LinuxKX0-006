; Custom NSIS script for Linux+ Mastery installer
; Adds option to install with or without AI features

!include "MUI2.nsh"
!include "LogicLib.nsh"

Var AIFeatures

; Custom page for AI features selection
Page custom AIFeaturesPage AIFeaturesPageLeave

Function AIFeaturesPage
  nsDialogs::Create 1018
  Pop $0

  ${NSD_CreateLabel} 0 0 100% 30u "Linux+ Mastery - Installation Options"
  Pop $0
  
  ${NSD_CreateLabel} 0 40u 100% 20u "Select the features you want to install:"
  Pop $0

  ${NSD_CreateCheckbox} 20u 70u 100% 15u "Enable AI-powered explanations (requires API key)"
  Pop $AIFeatures
  ${NSD_SetState} $AIFeatures ${BST_CHECKED}

  ${NSD_CreateLabel} 40u 90u 100% 40u "Note: AI features allow you to get detailed explanations for quiz questions using services like OpenAI, Claude, or DeepSeek. You will need to provide your own API key."
  Pop $0

  nsDialogs::Show
FunctionEnd

Function AIFeaturesPageLeave
  ${NSD_GetState} $AIFeatures $0
  ${If} $0 == ${BST_CHECKED}
    ; AI features enabled - don't set any environment variable
    WriteRegStr HKCU "Environment" "AI_FEATURES" ""
  ${Else}
    ; AI features disabled
    WriteRegStr HKCU "Environment" "AI_FEATURES" "disabled"
  ${EndIf}
  
  ; Notify the system of environment variable change
  SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
FunctionEnd
