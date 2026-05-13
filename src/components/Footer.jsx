const Footer = ({ showEasterEgg }) => {
  return (
    <footer>
      <span className="footer-txt">Ashish Dixit &middot; &copy;2025 All rights reserved</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {showEasterEgg && (
          <span className="footer-txt batman-egg">"Why do we fall? So we can learn to pick ourselves up"</span>
        )}
        <span className="footer-v">V10</span>
      </div>
    </footer>
  );
};

export default Footer;
