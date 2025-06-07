<?php

namespace App\Http\Controllers\Contacts;

use App\Data\Contacts\ContactData;
use App\Http\Controllers\Controller;
use App\Models\Contacts\Contact;
use Spatie\QueryBuilder\QueryBuilder;

class ContactController extends Controller
{
    public function index()
    {
        $fields = array_keys(ContactData::empty());
        $contact = new Contact;
        return QueryBuilder::for($contact->search())
            ->allowedFields($fields)
            ->allowedIncludes(['deals','events.user'])
            ->allowedFilters($fields)
            ->allowedSorts($fields)
            ->jsonPaginate();
    }

    public function store(ContactData $request)
    {
        $contact = Contact::create($request->toModel());

        return $this->show($contact);
    }

    public function show(Contact $contact)
    {
        return ContactData::from($contact->load(['events.user','deals']));
    }

    public function update(ContactData $request, Contact $contact )
    {
        $contact->update($request->toModel());

        return $this->show($contact);
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();

        return response()->json(null, 204);
    }
}
