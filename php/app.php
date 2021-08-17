<?php

use Stripe\Exception\ApiErrorException;
use Stripe\PaymentIntent;
use Stripe\Stripe;
use Stripe\Customer;

$i = 1;

while (!file_exists(dirname(__DIR__, $i) . '/vendor/autoload.php')){
    $i++;
}

require dirname(__DIR__, $i) . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

header('Content-Type: application/json');

try {
    $json = json_decode(file_get_contents('php://input'));

    if(!$json->payment){
        http_response_code(400);
        echo json_encode(['error' =>'Payment type required.']);
        die();
    }

    $customer = null;

    if($json->email){
        $customers = Customer::all(['email' => $json->email]);

        if($customers->count()){
            $customer = $customers->first();

            $customer->updateAttributes([
                'email' => $json->email ?? null,
                'name' => $json->name ?? null,
                'phone' => $json->phone ?? null,
            ]);
        } else {
            $customer = Customer::create([
                'email' => $json->email ?? null,
                'name' => $json->name ?? null,
                'phone' => $json->phone ?? null,
            ]);
        }
    }

    switch ($json->payment){
        default:
        case 'paymentOneTime':
            $payment = PaymentIntent::create([
                'amount' => $_ENV['PRICE_ONE_TIME'] * 100,
                'currency' => 'usd',
                'customer' => $customer,
            ]);
            break;
        case 'paymentPlan':
            return $_ENV['PRICE_PLAN'] * 100;
            break;
    }

    $output = [
        'clientSecret' => $payment->client_secret,
    ];

    echo json_encode($output);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} catch (ApiErrorException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
