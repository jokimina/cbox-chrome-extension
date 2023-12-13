export default function FootBar() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: '0.5rem',
        paddingRight: '0.5rem',
        height: '2rem',
      }}
    >
      <img
        src={chrome.runtime.getURL('icon.png')}
        style={{
          width: '1rem',
          height: '1rem',
          marginRight: '0.5rem',
        }}
      />{' '}
      {chrome.runtime.getManifest().name} v
      {chrome.runtime.getManifest().version}
      {/* docs */}
      <a
        href={'https://cbox-docs.vercel.app'}
        target="_blank"
        rel="noreferrer"
        style={{
          marginLeft: '0.5rem',
          textDecoration: 'underline',
        }}
      >
        docs
      </a>
      {/* twitter  */}
      <a
        href={'https://twitter.com/guageaaa'}
        target="_blank"
        rel="noreferrer"
        style={{
          marginLeft: '0.5rem',
          textDecoration: 'underline',
        }}
      >
        twitter
      </a>
      {/* email */}
      <a
        href={'mailto:xiaodong.fun@gmail.com'}
        target="_blank"
        rel="noreferrer"
        style={{
          marginLeft: '0.5rem',
          textDecoration: 'underline',
        }}
      >
        email
      </a>
    </div>
  );
}
