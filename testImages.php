<?php
/*
    PHP image slideshow - auto version - PHP > 5.0
*/
// set the absolute path to the directory containing the images
define("IMGDIR", "./images/plants/" . $_GET["rastlina"] . "/");
// same but for www
define("WEBIMGDIR", "./images/plants/" . $_GET["rastlina"] . "/");
// set session name for slideshow "cookie"
const SS_SESSNAME = 'slideshow_sess';
// global error variable
$err = '';
// start img session
session_name(SS_SESSNAME);
session_start();
// init slideshow class
$ss = new slideshow($err);
if (($err = $ss->init()) != '')
{
    header('HTTP/1.1 500 Internal Server Error');
    echo $err;
    exit();
}
// get image files from directory
$ss->get_images();
// set variables, done.
list($curr, $caption, $first, $prev, $next, $last) = $ss->run();
/*
    slideshow class, can be used stand-alone
*/
class slideshow
{
    private $files_arr = NULL;

    public function __construct(&$err)
    {
        $this->files_arr = array();
        $this->err = $err;
    }
    public function init()
    {
        // run actions only if img array session var is empty
        // check if image directory exists
        if (!$this->dir_exists())
        {
            return 'Error retrieving images, missing directory';
        }
        return '';
    }
    public function get_images()
    {
        // run actions only if img array session var is empty
        if (isset($_SESSION['imgarr']))
        {
            $this->files_arr = $_SESSION['imgarr'];
        }
        else
        {
            if ($dh = opendir(IMGDIR))
            {
                while (false !== ($file = readdir($dh)))
                {
                    if (preg_match('/^.*\.(jpg|jpeg|gif|png)$/i', $file))
                    {
                        $this->files_arr[] = $file;
                    }
                }
                closedir($dh);
            }
            $_SESSION['imgarr'] = $this->files_arr;
        }
    }
    public function run()
    {
        $curr = 1;
        $last = count($this->files_arr);
        if (isset($_GET['img']))
        {
            if (preg_match('/^[0-9]+$/', $_GET['img'])) $curr = (int)  $_GET['img'];
            if ($curr <= 0 || $curr > $last) $curr = 1;
        }
        if ($curr <= 1)
        {
            $prev = $curr;
            $next = $curr + 1;
        }
        else if ($curr >= $last)
        {
            $prev = $last - 1;
            $next = $last;
        }
        else
        {
            $prev = $curr - 1;
            $next = $curr + 1;
        }
        // line below sets the caption name...
        $caption = str_replace('-', ' ', $this->files_arr[$curr - 1]);
        $caption = str_replace('_', ' ', $caption);
        $caption = preg_replace('/\.(jpe?g|gif|png)$/i', '', $caption);
        $caption = ucfirst($caption);
        return array($this->files_arr[$curr - 1], $caption, 1, $prev, $next, $last);
    }
    private function dir_exists()
    {
        return file_exists(IMGDIR);
    }
}
?>
<!DOCTYPE html>
<html lang="sl">
<?php include './head.html';?>
<body onload="loadPlantText()">
<?php include './navigation.html';?>

<article>
    <div class="outer">
        <div class="inner">
            <div id="loadTextDivId"></div>
            <div id="loadImageSlideshow">
                <div class="gallery">
                    <div class="gallery-nav">
                        <a href="?img=<?=$first;?>&rastlina=<?=$_GET["rastlina"]?>">Prva</a>
                        <a href="?img=<?=$prev;?>&rastlina=<?=$_GET["rastlina"]?>">Prejšnja</a>
                        <span class="sp"></span>
                        <a href="?img=<?=$next;?>&rastlina=<?=$_GET["rastlina"]?>">Naslednja</a>
                        <a href="?img=<?=$last;?>&rastlina=<?=$_GET["rastlina"]?>">Zadnja</a>
                    </div>
                    <div class="gallery-image">
                        <img src="<?=WEBIMGDIR;?><?=$curr;?>" alt="Slika <?=$_GET["rastlina"]?>" style="width: 100%"/>
                    </div>
                    <p class="gallery-image-label"><?=$caption;?></p>
                </div>
            </div>
        </div>
    </div>
</article>

<?php include './footer.html';?>
</body>
</html>