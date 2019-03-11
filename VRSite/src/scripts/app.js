var scene, camera, renderer, clock, deltaTime;
var mixer;
var arToolkitSource, arToolkitContext;
var markerGroup, markerGroupInner;
var video,
  videoMesh,
  videoState = 'stop';
var isDebug = false;
var $preloader = $('.preloader');
var $preloaderNodes;
var preloaderTL = new TimelineMax({
  paused: true,
  repeat: -1,
  delay: 1.15
});

function checkDevice(cb) {
  var ua = new UAParser();
  if (ua.getResult().os.name === 'iOS') {
    // alert(ua.getResult().browser.name + '/' + ua.getResult().device.model + '/' + ua.getResult().os.name + '@' + ua.getResult().os.version);

    if (ua.getResult().os.version < 11) {
      alert('Sorry, this demo only works with iOS version 11 and up');
      $preloader.html('Sorry, this demo only works with iOS version 11 and up');
      return;
    } else if (ua.getResult().browser.name === 'Chrome') {
      alert('Error, Please use Safari.');
      $preloader.html('Error, Please use Safari.');
      return;
    }
  }

  cb();
}

function initPreloader() {
  $preloader.empty();
  _.times(8, function() {
    $('<div class="preloader__node"></div>').appendTo($preloader);
  });
  $preloaderNodes = $('.preloader__node');

  var loaderAmount = $preloaderNodes.length,
    angle = 360 / loaderAmount,
    //Spin velocity, smaller the value, faster it rotates
    spinSpeed = 0.05;

  TweenMax.set($preloader, {
    perspective: 300
  });

  $.each($preloaderNodes, function(i) {
    var alpha = 0.1 * i + 0.3;

    TweenMax.set($(this), {
      left: 150,
      top: 100
    });

    TweenMax.to($(this), 1, {
      rotationY: (i + 1) * angle,
      transformOrigin: '50% 50% -100px',
      autoAlpha: alpha
    });

    preloaderTL.set($preloaderNodes, {
      rotationY: '+=' + angle,
      transformOrigin: '50% 50% -100px',
      // eslint-disable-next-line
      ease: Linear.easeNone,
      delay: spinSpeed
    });
  });
  preloaderTL.play();
}

function initialize() {
  scene = new THREE.Scene();
  isDebug = Utils.getUrlParams('debug');

  var ambientLight = new THREE.AmbientLight(0xcccccc, 1.0);
  scene.add(ambientLight);

  if (isDebug) {
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 0, 10);
    camera.lookAt(new THREE.Vector3());
  } else {
    camera = new THREE.Camera();
  }
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setClearColor(new THREE.Color('lightgrey'), 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0px';
  renderer.domElement.style.left = '0px';
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock();
  deltaTime = 0;

  if (!isDebug) {
    setupAR();
  }

  markerGroup = new THREE.Group();
  markerGroupInner = new THREE.Group();
  markerGroup.add(markerGroupInner);
  scene.add(markerGroup);

  preloadVideo('./content/augmented_spaces_compressed.mp4', function(src) {
    video = $('#video')[0];
    $('#video source').attr('src', src);

    var map = new THREE.VideoTexture(video);
    map.minFilter = THREE.LinearFilter;
    map.magFilter = THREE.LinearFilter;
    var material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      map: map,
      side: THREE.DoubleSide
    });
    material.format = THREE.RGBFormat;
    var geometry = new THREE.PlaneBufferGeometry(1, 1);
    videoMesh = new THREE.Mesh(geometry, material);

    if (!isDebug) {
      videoMesh.rotation.x = -Math.PI / 2;
    }

    setTimeout(function() {
      $preloader.addClass('hide');
      preloaderTL.stop();

      $('.start-con').removeClass('hide');
      $('.start-con').on('touchstart', function() {
        $('.start-con').addClass('hide');
        onStart();
        video.stop();
      });
    }, 1000);
  });
}

function onStart() {
  if (isDebug) {
    scene.add(videoMesh);

    try {
      video.play();
    } catch (e) {
      console.log(e);
    }

    var helper = new THREE.GridHelper(1000, 40, 0x303030, 0x303030);
    scene.add(helper);

    animate();
  } else {
    if (arToolkitContext) {
      var markerControl = new THREEx.ArMarkerControls(arToolkitContext, markerGroup, {
        type: 'pattern',
        patternUrl: 'data/pattern-marker.patt'
      });
      // markerControl.addEventListener('markerFound', function() {
      //   if (markerGroup.visible) {
      //     if (video && video.play && videoState === 'stop') {
      //       videoState = 'playing';
      //       video.currentTime = 0;
      //       video.play();
      //       alert('playing');
      //     }
      //   }
      // });
      // markerControl.addEventListener('markerLost', function() {
      //   if (!markerGroup.visible) {
      //     if (video && video.stop && videoState === 'playing') {
      //       video.stop();
      //       videoState = 'stop';
      //       alert('stop');
      //     }
      //   }
      // });
    }

    markerGroupInner.add(videoMesh);

    beginAR();
    animate();
  }
}

function setupAR() {
  arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: 'webcam'
  });

  // create atToolkitContext
  arToolkitContext = new THREEx.ArToolkitContext({
    // debug: false,
    cameraParametersUrl: 'data/camera_para.dat',
    detectionMode: 'color_and_matrix'
  });

  // copy projection matrix to camera when initialization complete
  arToolkitContext.init(function onCompleted() {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  });
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);

  arToolkitSource.onResizeElement();
  arToolkitSource.copyElementSizeTo(renderer.domElement);
  if (arToolkitContext.arController !== null) {
    arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
  }
}

function onScroll() {
  onResize();
}

function beginAR() {
  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', onScroll);
  arToolkitSource.init(function onReady() {
    onResize();
  });
}

function update() {
  if (arToolkitSource && arToolkitSource.ready !== false) {
    arToolkitContext.update(arToolkitSource.domElement);
    scene.visible = camera.visible;
  }
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  deltaTime = clock.getDelta();
  if (typeof mixer !== 'undefined') {
    mixer.update(deltaTime);
  }

  if (video) {
    if (!markerGroup.visible) {
      if (videoState === 'playing') {
        // alert('stop');
        try {
          video.stop();
        } catch (e) {
          // alert('stop error');
        }
        videoState = 'stop';
      }
    } else {
      if (video.play && videoState === 'stop') {
        videoState = 'playing';
        video.currentTime = 0;
        try {
          video.play();
        } catch (e) {
          // alert('play error');
        }
        // alert('playing');
      }
    }
  }

  update();
  render();
}

function preloadVideo(url, cb) {
  var req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.responseType = 'blob';

  req.onload = function() {
    if (this.status === 200) {
      if (cb) {
        cb(URL.createObjectURL(this.response));
      }
    }
  };

  req.onerror = function() {
    alert('Error loading content. Please refresh the page without leaving the browser.');
  };

  req.send();
}

checkDevice(function() {
  initPreloader();
  $(document).ready(function() {
    $preloader.removeClass('hide');

    initialize();
  });
});
