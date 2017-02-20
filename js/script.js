var cvxInteractive = document.getElementById('cvx-interactive'),
    cvxReference = document.getElementById('cvx-reference'),
    ctxInteractive = cvxInteractive.getContext('2d'),
    ctxReference = cvxReference.getContext('2d'),
    imgDir = "images/";



var particleAttrs = {
    friction: .90,
    ease: 0.20,
    spacing: 4,
    size: 2,
    color: "#fff"
};

var logoImg = new Image();
logoImg.crossOrigin = '';


logoImg.onload = function() {
    var width = cvxInteractive.width = cvxReference.width = window.innerWidth,
        height = cvxInteractive.height = cvxReference.height = window.innerHeight,
        logoDimensions = {
            x: logoImg.width,
            y: logoImg.height
        },
        center = {
            x: width / 2,
            y: height / 2
        },
        logoLocation = {
            x: center.x - logoDimensions.x / 2,
            y: center.y - logoDimensions.y / 2
        },
        mouse = {
            radius: Math.pow(100, 2),
            x: 0,
            y: 0
        },
        particleArr = [];

    function Particle(x, y, hex) {
        this.x = this.originX = x;
        this.y = this.originY = y;
        this.rx = 0;
        this.ry = 0;
        this.vx = 0;
        this.vy = 0;
        this.force = 0;
        this.angle = 0;
        this.distance = 0;
        this.color = hex;
    }

    Particle.prototype.updatePos = function() {
        this.rx = mouse.x - this.x;
        this.ry = mouse.y - this.y;
        this.distance = this.rx * this.rx + this.ry * this.ry;
        this.force = -mouse.radius / this.distance;
        if (this.distance < mouse.radius) {
            this.angle = Math.atan2(this.ry, this.rx);
            this.vx += this.force * Math.cos(this.angle);
            this.vy += this.force * Math.sin(this.angle);
        }
        this.x += (this.vx *= particleAttrs.friction) + (this.originX - this.x) * particleAttrs.ease;
        this.y += (this.vy *= particleAttrs.friction) + (this.originY - this.y) * particleAttrs.ease;
    };

    function rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }

    function init() {
        ctxReference.drawImage(logoImg, logoLocation.x, logoLocation.y);

        var pixels = ctxReference.getImageData(0, 0, width, height).data,
            index;

        for (var y = 0; y < height; y += particleAttrs.spacing) {
            for (var x = 0; x < width; x += particleAttrs.spacing) {
                index = (y * width + x) * 4;
                if (pixels[++index] > 0) {
                    var p = ctxReference.getImageData(x, y, particleAttrs.size, particleAttrs.size).data;
                    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
                    particleArr.push(new Particle(x, y, hex));
                }
            }
        }
    };

    function updateParticle() {
        for (var i = 0; i < particleArr.length; i++) {
            var p = particleArr[i];
            p.updatePos();
        }
    };

    function renderParticle() {
        ctxInteractive.clearRect(0, 0, width, height);
        for (var i = 0; i < particleArr.length; i++) {
            var p = particleArr[i];
            ctxInteractive.fillStyle = p.color;
            ctxInteractive.fillRect(p.x, p.y, particleAttrs.size, particleAttrs.size);
        }
    };

    function animate() {
        updateParticle();
        renderParticle();
        window.animReq = requestAnimationFrame(animate);
    }

    $('body').on('mousemove', function(){
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    $(window).on('resize', function(){
        console.log('resizing');
    });

    init();
    animate();
    $('#loading').fadeOut();
};
logoImg.crossOrigin = '';
logoImg.src = "https://www.dropbox.com/s/qi2q4jf2n6m0eqy/profile%20cropped.jpg?dl=0";
$('select').on('change', function() {
    var el = this;
    $('#loading').fadeIn(function() {
        window.cancelAnimationFrame(animReq);
        logoImg.src = el.value;
    });
});
