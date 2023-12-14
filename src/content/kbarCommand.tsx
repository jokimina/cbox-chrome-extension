import {
  ActionId,
  ActionImpl,
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarResults,
  KBarSearch,
} from 'kbar';
import React from 'react';
import FootBar from '../components/footBar';
import useBookmarkActions from './hooks/useBookmarkActions';
import useHistoryActions from './hooks/useHistoryActions';
import { useMatches } from './hooks/useMatches';
import useOpenedTabActions from './hooks/useOpenedTabActions';
import { useQuickSearchActions } from './hooks/useQuickSearchActions';
import useCommandActions from './hooks/useCommandActions';
import { useRecentActions } from './hooks/useRecentActions';

export default function KbarCommand() {
  useRecentActions();
  useOpenedTabActions();
  // useCommandActions();
  // useHistoryActions();
  // useBookmarkActions();
  // useQuickSearchActions();

  return (
    <KBarPortal>
      <KBarPositioner
        style={{
          zIndex: 10000,
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        <KBarAnimator style={animatorStyle}>
          <KBarSearch style={searchStyle} />
          <RenderResults />
          <FootBar />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}

const searchStyle = {
  padding: '12px 16px',
  fontSize: '16px',
  width: '100%',
  boxSizing: 'border-box' as React.CSSProperties['boxSizing'],
  outline: 'none',
  border: 'none',
  background: 'rgb(252 252 252)',
  color: 'rgb(28 28 29)',
};

const animatorStyle = {
  maxWidth: '600px',
  width: '100%',
  zIndex: 1000,
  background: 'rgb(252 252 252)',
  color: 'rgb(28 28 29)',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0px 6px 20px rgb(0 0 0 / 20%)',
};

const groupNameStyle = {
  padding: '8px 16px',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  opacity: 0.5,
};

function RenderResults() {
  const { results, rootActionId } = useMatches();
  let data = results.map((item) => {
    if (typeof item === 'string') {
      return item;
    } else {
      return item.action;
    }
  });

  if (!!!data?.length) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          height: '32px',
        }}
      >
        <p>No recent searches</p>
      </div>
    );
  }

  return (
    <KBarResults
      // items={results}
      items={data}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div style={groupNameStyle}>{item}</div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId ?? ''}
          />
        )
      }
    />
  );
}

const ResultItem = React.forwardRef(
  (
    {
      action,
      active,
      currentRootActionId,
    }: {
      action: ActionImpl;
      active: boolean;
      currentRootActionId: ActionId;
    },
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const ancestors = React.useMemo(() => {
      if (!currentRootActionId) return action.ancestors;
      const index = action.ancestors.findIndex(
        (ancestor: any) => ancestor.id === currentRootActionId,
      );
      // +1 removes the currentRootAction; e.g.
      // if we are on the "Set theme" parent action,
      // the UI should not display "Set theme… > Dark"
      // but rather just "Dark"
      return action.ancestors.slice(index + 1);
    }, [action.ancestors, currentRootActionId]);

    return (
      <div
        ref={ref}
        style={{
          padding: '12px 16px',
          background: active ? 'rgba(0 0 0 / 0.05)' : 'transparent',
          borderLeft: `2px solid ${active ? 'rgb(28 28 29)' : 'transparent'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            fontSize: 14,
          }}
        >
          {action.icon && action.icon}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
              {ancestors?.length > 0 &&
                ancestors.map((ancestor: any) => (
                  <React.Fragment key={ancestor.id}>
                    <span
                      style={{
                        opacity: 0.5,
                        marginRight: 8,
                      }}
                    >
                      {ancestor.name}
                    </span>
                    <span
                      style={{
                        marginRight: 8,
                      }}
                    >
                      &rsaquo;
                    </span>
                  </React.Fragment>
                ))}
              <span>{action.name}</span>
            </div>
            {action.subtitle && (
              <span style={{ fontSize: 12 }}>{action.subtitle}</span>
            )}
          </div>
        </div>
        {action.shortcut?.length ? (
          <div
            aria-hidden
            style={{ display: 'grid', gridAutoFlow: 'column', gap: '4px' }}
          >
            {action.shortcut.map((sc: any) => (
              <kbd
                key={sc}
                style={{
                  padding: '4px 6px',
                  background: 'rgba(0 0 0 / .1)',
                  borderRadius: '4px',
                  fontSize: 14,
                }}
              >
                {sc}
              </kbd>
            ))}
          </div>
        ) : null}
      </div>
    );
  },
);
