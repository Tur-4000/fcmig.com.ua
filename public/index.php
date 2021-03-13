<?php

require __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;
use DI\Container;
use Slim\Views\Twig;
use Slim\Views\TwigMiddleware;

$container = new Container();
AppFactory::setContainer($container);

$container->set('view', function () {
    // return Twig::create('../templates', ['cache' => '../cache/view']);
    return Twig::create('../templates', []);
});

$app = AppFactory::create();
$app->add(TwigMiddleware::createFromContainer($app));

$app->addErrorMiddleware(true, true, true);

$app->get('/', function ($request, $response, $args) {
    $params = ['pageName' => 'О нас'];
    return $this->get('view')->render($response, 'main.twig', $params);
})->setName('home');

$app->get('/owners', function ($request, $response, $args) {
    $params = ['pageName' => 'структура власності'];
    return $this->get('view')->render($response, 'owners.twig', $params);
})->setName('owners');

$app->get('/services', function ($request, $response, $args) {
    $params = ['pageName' => 'Услуги'];
    return $this->get('view')->render($response, 'services.twig', $params);
})->setName('services');

$app->get('/documents', function ($request, $response, $args) {
    $params = ['pageName' => 'Документы'];
    return $this->get('view')->render($response, 'documents.twig', $params);
})->setName('documents');

$app->get('/contacts', function ($request, $response, $args) {
    $params = ['pageName' => 'Контакты'];
    return $this->get('view')->render($response, 'contacts.twig', $params);
})->setName('contacts');

$app->run();
