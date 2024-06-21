import React from "react";

const Header = () => {
  return (
    <>
      <div className="w-full bg-white top-0">
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 opacity-70 w-full text-center px-0 py-3 rounded-[1px]">
          <p className="max-w-s mx-auto my-0 text-sm font-normal leading-[120%] text-white m-0">
            Introducing UXMagic.ai- Idea to Interface in seconds 🎉
          </p>
        </div>
        <nav className="">
          <div className="container flex justify-between mt-3">
            <a href="#">
              <img src="/header-logo.svg" alt="" />
            </a>
            <button
              className="border-2 border-purple-400 rounded-[32px] p-3 md:p-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <a
                className=""
                href="https://join.slack.com/t/uxmagicai/shared_invite/zt-2d8rlx775-LUCKhLTcaIK0WcajtUiSpQ"
                target="_blank"
              >
                <span className="bg-gradient-to-r from-custom-purple to-custom-blue">
                  Join our Slack Community
                </span>
              </a>
            </button>
          </div>
        </nav>
      </div>

      <div className="flex flex-col justify-center items-center">
        <h2 className="text-center text-6xl font-bold leading-[100px] tracking-tight max-w-[994px] mx-auto mb-10 text-[#091E42]">
          Ideas to Interface in{" "}
          <span className="relative bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text ">
            seconds
          </span>
          {/* <div className="absolute inset-0 bg-no-repeat bg-cover bg-[url('/tick.svg')] w-[100%] top-[72px] left-[20px] h-[14px]  "></div> */}
        </h2>
        <p className="text-[#42566e] text-lg font-normal leading-[150%] text-center mb-8">
          Get early access.
        </p>
        <form className="flex flex-row justify-center border-2 w-[600px] rounded-[45px] h-[70px]">
          <div className="flex justify-between items-center px-2 md:px-4 py-2 w-full">
            <div className="flex items-center gap-3 w-3/4">
              <img src="/form-icon.png" alt="" className="w-6 h-6 mt-0 ml-2" />
              <input
                type="text"
                className="text-gray-600 text-sm font-normal leading-[120%] border-0 w-full"
                placeholder="Share your email id."
              />
            </div>
            <button
              type="button"
              className="py-3 px-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium text-base md:text-sm flex justify-center items-center min-w-[134px]"
            >
              Sign up Now
            </button>
          </div>
        </form>
        <div className="flex justify-center items-center mb-16">
          <video
            className="w-[70%]  rounded-t-[25px] mt-14 drop-shadow-custom "
            src="https://redbaton.s3.ap-south-1.amazonaws.com/uxmagic_landing_page/UX_Magic.mp4"
            autoPlay
            loop
            muted
          ></video>
        </div>
      </div>

      <div className="third-section">
        <div className="container">
          <h3 className="text-[#091e42] text-center text-5xl font-bold leading-[130%] tracking-[-0.24px] w-[524px] mb-9 mx-auto pb-[50px] mt-16">
            It’s time to delegate to AI with
            <span
              className="relative text-[#256bfa] before:absolute 
            before:content-[] 
            before:bg-[url('/tick.svg)] before:w-[232px] before:h-3 before:bottom-[-32%] before:bg-cover before:left-[30px]"
            >
              {" "}
              Uxmagic.ai
            </span>
          </h3>

          <div className="third-section-wrapper">
            <div className="third-info  shadow-[0px_4px_16px_-8px_rgba(0,0,0,0.08)] mb-8 px-8 py-10 rounded-lg">
              <div className="third-info-content flex flex-col items-start">
                <h4 className="title text-[#091E42] text-center text-2xl font-bold leading-[130%] mb-4">Ideate</h4>
                <p className="third-desc text-[#505f79] text-lg font-normal leading-[150%]">
                  Get your ideas to interface in seconds with our AI-powered -
                  text to Interface solution.
                </p>
              </div>
              <div className="ui-screen w-[100%]">
                <div className="header bg-white h-[62px] flex justify-between items-center px-8 py-2 rounded-[8px_8px_0_0] border-b-[#eeeff1] border-b border-solid">
                  <div className="logo">
                    <img className="w-[136px] h-auto" src="/header-logo.svg" alt="" />
                  </div>
                  <div className="header__content flex justify-center items-center gap-1 text-[#505f79]">
                    <p>Ideate</p>
                    <img className="w-[20px] h-[20px]" src="/chevron-down.svg" alt="" />
                  </div>
                  <div className="icons flex justify-between items-center gap-6">
                    <div className="icon--text">
                      <img className="w-[16px] h-[16px]" src="/help.svg" alt="" />
                      <span className=" text-xs">Help</span>
                    </div>
                    <div className="avatar h-6 w-6 rounded-[50%]">
                      <img src="/user.png" alt="" />
                    </div>
                  </div>
                </div>
                <div className="content bg-[#020204] rounded-[0_0_8px_8px]">
                  <video
                    src="https://redbaton.s3.ap-south-1.amazonaws.com/uxmagic_landing_page/ideate-section.mp4"
                    className="ai-image w-[100%]"
                    autoPlay
                    loop
                    muted
                    ></video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Header;
