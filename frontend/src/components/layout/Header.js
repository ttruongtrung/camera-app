import { ReactComponent as Logo } from '../../assets/icons/logo.svg';

const Header = () => {
  return (
    <div className="flex justify-between p-2 pb-3">
      <div className="flex flex-col">
        <span className="text-orangeE text-3xl">CAMERA</span>
        <span className="text-white text-lg leading-none">BILLIARDS VIEW</span>
      </div>
      <a href="https://tasse.vn" rel="noreferrer noopener" target="_blank">
        <Logo className="h-10" />
      </a>
    </div>
  );
};

export default Header;
