        <html lang="en">
          <head>
            <style type="text/css">
                #whole {
                    width: 70%;
                    display: block;
                    border: 6px solid #0d10a8;
                    position: relative;
                }
                #header-logo {
                    display: block;
                    width: 4rem;
                    height: 4rem;
                    padding: 0;
                    position: absolute;
                    top: 3rem;
                    left: 50%;
                    transform: translateX(-50%);
                }
                #header-logo img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                }
                @keyframes logo-anim {
                  0% {width: 3.5rem; height: 3.5rem;}
                  100% {width: 4rem; height: 4rem;}
                 }
                #header-logo:hover {
                    animation-name: logo-anim;
                    animation-duration: 1s;
                }
                .mydiv {
                    background: #f9e8fc;
                    padding: 40px 10%;
                    border-radius: 5px;
                    width: 80%;
                    font-size: 0.9rem;
                }
                .mydiv .inner{
                    margin: 0 0 1rem 0;
                    padding: 0;
                    display: block;
                }
                
                .mydiv .inner.link{
                    font-size: 0.7rem;
                }
                
            </style>
            <meta charset="UTF-8">
            <meta name="description" content="An Email for reseting password">
            <meta name="keywords" content="HTML, CSS, JavaScript">
            <meta name="author" content="Mohammad Shafaei">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body>
          <div id="whole">
                  <div id="header-logo">
                    <a href="https://cryptoinfer.com/">
                       <img src="https://cryptoinfer.com/images/logo-ci.png" alt="cryptoinfer.com">
                    </a>
           </div>
           <div class="mydiv">
            <div class="inner">Dear {{$name }}, please note that your password is changed!</div>
            <div class="inner">If you did not changed the password, please contact an admin and report the issue immediately.</div>
           </div>
          </div>
        </body>
        </html>