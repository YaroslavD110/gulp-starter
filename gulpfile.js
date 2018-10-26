const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const cleancss = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const gcmq = require("gulp-group-css-media-queries");
const notify = require("gulp-notify");
const npmDist = require("gulp-npm-dist");
const zip = require("gulp-zip");

// Config
const dist = "./dist";
const src = "./src";

// Tasks
gulp.task("BrowserSync", () => {
  browserSync.init({
    server: {
      baseDir: `${src}`
    },
    notify: false
    // open: false,
    // online: false, // Work Offline Without Internet Connection
    // tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
  });
});

// Task for compiling styles
gulp.task("Styles", () =>
  gulp
    .src(`${src}/scss/**/*.scss`)
    .pipe(
      sass({
        outputStyle: "expanded",
        sourcemap: true
      }).on("error", notify.onError())
    )
    .pipe(gcmq().on("error", notify.onError()))
    .pipe(rename({ suffix: ".min" }))
    .pipe(autoprefixer(["last 15 versions"]))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
    .pipe(gulp.dest(`${src}/css`))
    .pipe(browserSync.reload({ stream: true }))
);

// Cope dependencies
gulp.task("JSLibs", function() {
  gulp
    .src(npmDist(), { base: "./node_modules/" })
    .pipe(
      rename(path => {
        path.dirname = path.dirname.replace(/\/dist/, "").replace(/\\dist/, "");
      })
    )
    .pipe(gulp.dest(`${src}/libs`));
});

// Task for minify images
gulp.task("ImgMin", () =>
  gulp
    .src(`${src}/img`)
    .pipe(changed(`${dist}/img`))
    .pipe(imagemin())
    .pipe(gulp.dest(`${dist}/img`))
);

gulp.task("CustomJS", () =>
  gulp
    .src(`${src}/js/common.js`)
    .pipe(uglify().on("error", notify.onError()))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(`${src}/js`))
);

// Task for building js
gulp.task("Scripts", ["CustomJS"], () =>
  gulp
    .src(["./src/libs/jquery/jquery.min.js", "./src/js/common.min.js"])
    .pipe(concat("scripts.min.js"))
    //.pipe(uglify().on("error", notify.onError())) // Mifify js (opt.)
    .pipe(gulp.dest(`${src}/js`))
);

// Task for building project
gulp.task("build", ["ImgMin", "Styles", "Scripts"], () => {
  gulp.src(`${src}/img/**/*`).pipe(gulp.dest(`${dist}/img`));

  gulp.src(`${src}/fonts/**/*`).pipe(gulp.dest(`${dist}/fonts`));

  gulp.src(`${src}/css/**/*.css`).pipe(gulp.dest(`${dist}/css`));

  gulp.src(`${src}/js/**/*.js`).pipe(gulp.dest(`${dist}/js`));

  gulp.src(`${src}/**/*.html`).pipe(gulp.dest(`${dist}`));
});

// Create production zip
gulp.task("zip", () =>
  gulp
    .src(`${dist}/**/*`)
    .pipe(zip("production.zip"))
    .pipe(gulp.dest("./"))
);

// Task for reloading browser after changing
gulp.task("default", ["Styles", "Scripts", "BrowserSync"], () => {
  gulp.watch(`${src}/scss/**/*.scss`, ["Styles"]);
  gulp.watch(`${src}/js/*.js`, ["Scripts"]);
  gulp.watch(`${src}/*.html`).on("change", browserSync.reload);
});

// Common
function Inject(files) {
  return gulp
    .src(`${src}/**/*.html`)
    .pipe(
      inject(files, {
        transform(filepath) {
          newFilePath = filepath.replace(/\/src\//, "");
          return `<script src="${newFilePath}"></script>`;
        }
      }).on("error", notify.onError())
    )
    .pipe(gulp.dest(src))
    .pipe(browserSync.reload({ stream: true }));
}
