    <x-moonshine::form.wrapper label="Создание">
        <x-moonshine::form.switcher
            name="permissions[company][create]"
            :onValue="1"
            value="1"
            :offValue="0"
            :checked="@$value['company']['create'] == 1" />
    </x-moonshine::form.wrapper>
    <x-moonshine::form.wrapper label="Чтение">
        <x-moonshine::form.switcher
            name="permissions[company][read]"
            :onValue="1"
            value="1"
            :offValue="0"
            :checked="@$value['company']['read'] == 1" />
    </x-moonshine::form.wrapper>
    <x-moonshine::form.wrapper label="Изменение">
        <x-moonshine::form.switcher
            name="permissions[company][update]"
            :onValue="1"
            value="1"
            :offValue="0"
            :checked="@$value['company']['update'] == 1" />
    </x-moonshine::form.wrapper>
    <x-moonshine::form.wrapper label="Удаление">
        <x-moonshine::form.switcher
            name="permissions[company][delete]"
            :onValue="1"
            value="1"
            :offValue="0"
            :checked="@$value['company']['delete'] == 1" />
    </x-moonshine::form.wrapper>
    
