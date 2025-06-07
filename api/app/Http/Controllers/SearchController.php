<?php

namespace App\Http\Controllers;

use App\Models\Contacts\Contact;
use App\Models\Deals\Deal;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $search = $request->query('search', false);
        $contacts = Contact::search()->get();
        $deals = Deal::search()->with('contacts')->get();
        return ['deals' => $deals, 'contacts' => $contacts];
    }
}
