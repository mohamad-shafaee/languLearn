        <html lang="en">
          <head>
            <style type="text/css">
            #header-logo {
                    display: block;
                    width: 4rem;
                    height: 4rem;
                    margin: 4rem 50%;
                    padding: 0;
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
                    background: #FDAFE8;
                    padding: 40px;
                    border-radius: 5px;
                }
                .mydiv .inner{
                    margin: 0 0 1rem 0;
                    padding: 0;
                    display: block;
                }
            </style>
            <meta charset="UTF-8">
            <meta name="description" content="An Email for reseting password">
            <meta name="keywords" content="HTML, CSS, JavaScript">
            <meta name="author" content="Mohammad Shafaei">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
        <body>
        <div id="header-logo"> 
                    <a href="https://cryptoinfer.com/">
                       <img src="https://cryptoinfer.com/images/logo-ci.png" alt="cryptoinfer.com">
                    </a>
        </div>
        <div class="mydiv">
            <div class="inner">Dear {{ $name }} , please click the below link to activate your account.</div>
            <div class="inner">{{ $url }}</div>
        </div>
        </body>
        </html>