<?php

use Stripe\Exception\ApiErrorException;
use Stripe\PaymentIntent;
use Stripe\Price;
use Stripe\Product;
use Stripe\Stripe;
use Stripe\Customer;
use Stripe\Subscription;

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

    $customer = $clientSecret = null;

    if($json->email){
        $customers = Customer::all(['email' => $json->email]);

        if($customers->count()){
            $customer = $customers->first();

            Customer::update($customer->id, [
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

            $clientSecret = $payment->client_secret;
            break;
        case 'paymentPlan':
            $products = Product::all(['ids' => [$_ENV['PRODUCT_ID']]]);

            if($products->count()){
                $product = $products->first();
            } else {
                $product = Product::create([
                    'id' => $_ENV['PRODUCT_ID'],
                    'name' => 'Beauty Boss 2.0 - Payment plan',
                ]);
            }

            $prices = Price::all(['product' => $product->id]);

            if($prices->count()){
                $price = $prices->first();
            } else {
                $price = Price::create([
                    'currency' => 'usd',
                    'product' => $product->id,
                    'unit_amount' => $_ENV['PRICE_PLAN'] * 100,
                    'recurring' => [
                        'interval' => 'month',
                        'interval_count' => 3,
                    ]
                ]);
            }

            $subscription = Subscription::create([
                'customer' => $customer->id,
                'items' =>[
                    ['price' => $price->id]
                ],
                'payment_behavior' => 'default_incomplete',
                'expand' => ['latest_invoice.payment_intent'],
            ]);

            $clientSecret = $subscription->latest_invoice->payment_intent->client_secret;
            break;
    }

    $output = [
        'clientSecret' => $clientSecret,
    ];

    echo json_encode($output);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} catch (ApiErrorException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
