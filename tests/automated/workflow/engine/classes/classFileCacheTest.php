<?php
require_once PATH_TRUNK . 'gulliver/thirdparty/smarty/libs/Smarty.class.php';
require_once PATH_TRUNK . 'gulliver/system/class.xmlform.php';
require_once PATH_TRUNK . 'gulliver/system/class.xmlDocument.php';
require_once PATH_TRUNK . 'gulliver/system/class.form.php';
require_once PATH_TRUNK . 'gulliver/system/class.dbconnection.php';
require_once PATH_TRUNK . 'gulliver/thirdparty/propel/Propel.php';
require_once PATH_TRUNK . 'gulliver/thirdparty/creole/Creole.php';
require_once PATH_TRUNK . 'gulliver/thirdparty/pear/PEAR.php';
require_once PATH_TRUNK . 'workflow/engine/classes/class.fileCache.php';

/**
 * Generated by ProcessMaker Test Unit Generator on 2012-07-12 at 22:32:31.
*/

class classFileCacheTest extends PHPUnit_Framework_TestCase
{
    /**
     * @var FileCache
    */
    protected $object;

    /**
     * Sets up the fixture, for example, opens a network connection.
     * This method is called before a test is executed.
    */
    protected function setUp()
    {
        $this->object = new FileCache(null);
    }

    /**
     * Tears down the fixture, for example, closes a network connection.
     * This method is called after a test is executed.
    */
    protected function tearDown()
    {
    }

    /**
     * This is the default method to test, if the class still having
     * the same number of methods.
    */
    public function testNumberOfMethodsInThisClass()
    {
        $methods = get_class_methods('FileCache');
        $this->assertTrue(count($methods) == 6);
    }

    /**
    * @covers FileCache::__construct
    * @todo   Implement test__construct().
    */
    public function test__construct()
    {
        $methods = get_class_methods($this->object);
        $this->assertTrue( in_array('__construct', $methods ), 'exists method __construct' );
        $r = new ReflectionMethod('FileCache', '__construct');
        $params = $r->getParameters();
        $this->assertTrue( $params[0]->getName() == 'dir');
        $this->assertTrue( $params[0]->isArray() == false);
        $this->assertTrue( $params[0]->isOptional () == false);
    }

    /**
    * @covers FileCache::get
    * @todo   Implement testget().
    */
    public function testget()
    {
        $methods = get_class_methods($this->object);
        $this->assertTrue( in_array('get', $methods ), 'exists method get' );
        $r = new ReflectionMethod('FileCache', 'get');
        $params = $r->getParameters();
        $this->assertTrue( $params[0]->getName() == 'key');
        $this->assertTrue( $params[0]->isArray() == false);
        $this->assertTrue( $params[0]->isOptional () == false);
        $this->assertTrue( $params[1]->getName() == 'expiration');
        $this->assertTrue( $params[1]->isArray() == false);
        $this->assertTrue( $params[1]->isOptional () == true);
        $this->assertTrue( $params[1]->getDefaultValue() == '3600');
    }

    /**
    * @covers FileCache::set
    * @todo   Implement testset().
    */
    public function testset()
    {
        $methods = get_class_methods($this->object);
        $this->assertTrue( in_array('set', $methods ), 'exists method set' );
        $r = new ReflectionMethod('FileCache', 'set');
        $params = $r->getParameters();
        $this->assertTrue( $params[0]->getName() == 'key');
        $this->assertTrue( $params[0]->isArray() == false);
        $this->assertTrue( $params[0]->isOptional () == false);
        $this->assertTrue( $params[1]->getName() == 'data');
        $this->assertTrue( $params[1]->isArray() == false);
        $this->assertTrue( $params[1]->isOptional () == false);
    }

    /**
    * @covers FileCache::clear
    * @todo   Implement testclear().
    */
    /*public function testclear()
    {
        $methods = get_class_methods($this->object);
        $this->assertTrue( in_array('clear', $methods ), 'exists method clear' );
        $r = new ReflectionMethod('FileCache', 'clear');
        $params = $r->getParameters();
        $this->assertTrue( $params[0]->getName() == 'key');
        $this->assertTrue( $params[0]->isArray() == false);
        $this->assertTrue( $params[0]->isOptional () == false);
    }*/
}

