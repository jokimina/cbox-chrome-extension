import { useRegisterActions } from 'kbar';

export const CommandSection = 'Command';

export const isCommandPrompt = (text: string) => text.startsWith('>');

export default function useCommandActions() {
  useRegisterActions(
    [
      // open download
      {
        id: 'openDownloadAction',
        name: 'Open Download',
        subtitle: '>od,>/opendownload Open Download',
        section: CommandSection,
        keywords: '>od,>/opendownload',
        priority: 1,
        perform: () => {
          chrome.runtime.sendMessage({
            type: 'openDownload',
          });
        },
      },
      // go back tab
      {
        id: 'goBackTabAction',
        name: 'Go Back Tab',
        subtitle: '>gb,>goback Go to the previous tab ',
        section: CommandSection,
        keywords: '>gb,>goback,>back',
        priority: 100,
        perform: () => {
          chrome.runtime.sendMessage({
            type: 'goBackTab',
          });
        },
      },
      {
        id: 'newTabAction',
        name: 'New Tab',
        subtitle: '>nt,>newtab  Create New Tab',
        section: CommandSection,
        keywords: '>nt,>newtab',
        priority: 1,
        perform: () => {
          chrome.runtime.sendMessage({
            type: 'newTab',
          });
        },
      },
      // close right tabs
      {
        id: 'closeRightTabsAction',
        name: 'Close Right Tabs',
        subtitle: '>crt,>closerighttabs Close Right Tabs',
        section: CommandSection,
        keywords: '>crt,>closerighttabs',
        priority: 1,
        perform: () => {
          chrome.runtime.sendMessage({
            type: 'closeRightTabs',
          });
        },
      },
      // close left tabs
      {
        id: 'closeLeftTabsAction',
        name: 'Close Left Tabs',
        subtitle: '>clt,>closelefttabs Close Left Tabs',
        section: CommandSection,
        keywords: '>clt,>closelefttabs',
        priority: 1,
        perform: () => {
          chrome.runtime.sendMessage({
            type: 'closeLeftTabs',
          });
        },
      },
      // close all other tabs
      {
        id: 'closeOtherTabsAction',
        name: 'Close Other Tabs',
        subtitle: '>cot,>closeothertabs Close Other Tabs',
        section: CommandSection,
        keywords: '>cot,>closeothertabs',
        priority: 1,
        perform: () => {
          chrome.runtime.sendMessage({
            type: 'closeOtherTabs',
          });
        },
      },
      // new window
      {
        id: 'newWindowAction',
        name: 'New Window',
        subtitle: '>nw,>newwindow New Window',
        section: CommandSection,
        keywords: '>nw,>newwindow',
        perform: () => {
          chrome.runtime.sendMessage({
            type: 'newWindow',
          });
        },
      },
      // new incognito window
      {
        id: 'newIncognitoWindowAction',
        name: 'New Incognito Window',
        subtitle: '>niw,>newincognitowindow New Incognito Window',
        section: CommandSection,
        keywords: '>niw,>newincognitowindow',
        perform: () => {
          chrome.runtime.sendMessage({
            type: 'newIncognitoWindow',
          });
        },
      },
      // close current window
      {
        id: 'closeWindowAction',
        name: 'Close Window',
        subtitle: '>cw,>closewindow Close current window',
        section: CommandSection,
        keywords: '>cw,>closewindow',
        perform: () => {
          chrome.runtime.sendMessage({
            type: 'closeWindow',
          });
        },
      },
      // close other windo
      {
        id: 'closeOtherWindowAction',
        name: 'Close Other Window',
        subtitle: '>cow,>closeotherwindow Close other window',
        section: CommandSection,
        keywords: '>cow,>closeotherwindow',
        perform: () => {
          chrome.runtime.sendMessage({
            type: 'closeOtherWindow',
          });
        },
      },
      // pin tab
      {
        id: 'togglePinTabAction',
        name: 'Toggle Pin Tab',
        subtitle: '>pt,>pinTab  Toggle Pin Tab',
        section: CommandSection,
        keywords: '>pt,>pinTab',
        perform: () => {
          chrome.runtime.sendMessage({
            type: 'togglePinTab',
          });
        },
      },
      // replicate tab
      {
        id: 'replicateTabAction',
        name: 'Replicate Tab',
        subtitle: '>rt,>replicateTab  Replicate Tab',
        section: CommandSection,
        keywords: '>rt,>replicateTab',
        perform: () => {
          chrome.runtime.sendMessage({
            type: 'replicateTab',
          });
        },
      },
      // goto docs
      {
        id: 'gotoDocsAction',
        name: 'Go to Docs',
        subtitle: '>gd,>gotodocs Go to Docs',
        section: CommandSection,
        keywords: '>gd,>gotodocs',
        perform: () => {
          window.open('https://cbox-docs.vercel.app', '_blank')
        },
      },
    ],
    [],
  );
}
