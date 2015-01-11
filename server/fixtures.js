
var decemberBill;

if (Factures.find().count() === 0) {
    decemberBill = Factures.insert({
        timestamp: new Date(2014, 11),
        year: 2014,
        month: 11,
        state: 1
    });
}

if (CoffeeUsers.find().count() === 0) {
    var json = [
  {
    name:'Acebo',
    firstname:'Emilie',
    email:'eacebo@smartadserver.com',
    amount:3,
    delta:23
  },
  {
    name:'André',
    firstname:'Antoine',
    email:'aandre@smartadserver.com',
    amount:2,
    delta:5
  },
  {
    name:'Aullas',
    firstname:'Erwan',
    email:'eaullas@smartadserver.com',
    amount:3,
    delta:9
  },
  {
    name:'Bailhache',
    firstname:'Julien',
    email:'jbailhache@smartadserver.com',
    amount:2,
    delta:8,
    paid: 15
  },
  {
    name:'Barada',
    firstname:'Samer',
    email:'sbarada@smartadserver.com',
    amount:2,
    delta:18
  },
  {
    name:'Beaugendre',
    firstname:'Michaël',
    email:'mbeaugendre@smartadserver.com',
    amount:0,
    delta:0
  },
  {
    name:'Bel Jebbar',
    firstname:'Moos',
    email:'ebeljebbar@smartadserver.com',
    amount:9,
    delta:12.5,
    paid:50
  },
  {
    name:'Boitard',
    firstname:'Laurent',
    email:'lboitard@smartadserver.com',
    amount:2,
    delta:12
  },
  {
    name:'Boojhawon',
    firstname:'Rajiv',
    email:'rajiv.boojhawon@aufeminin.com',
    amount:3,
    delta:10
  },
  {
    name:'Cabotse',
    firstname:'Anne-Laure',
    email:'al.cabotse@aufeminin.com',
    amount:1,
    delta:28
  },
  {
    name:'Couasnon',
    firstname:'Ingrid',
    email:'icouasnon@smartadserver.com',
    amount:1,
    delta:6,
    paid:10
  },
  {
    name:'De Robert',
    firstname:'Nicolas',
    email:'nderobert@smartadserver.com',
    amount:3,
    delta:-2
  },
  {
    name:'Desmoules',
    firstname:'Adrien',
    email:'adesmoules@smartadserver.com',
    amount:2,
    delta:12
  },
  {
    name:'Desoutter',
    firstname:'Marine',
    email:'mdesoutter@smartadserver.com',
    amount:2,
    delta:6
  },
  {
    name:'Ding',
    firstname:'Tony',
    email:'tding@smartadserver.com',
    amount:2,
    delta:8,
    paid:17
  },
  {
    name:'Dupuy',
    firstname:'Bart',
    email:'bdupuy@smartadserver.com',
    amount:2,
    delta:12
  },
  {
    name:'Fau',
    firstname:'Alexandre',
    email:'alexandre.fau@gmail.com',
    amount:4,
    delta:0
  },
  {
    name:'Ferry',
    firstname:'Sébastien',
    email:'sferry@smartadserver.com',
    amount:2,
    delta:2
  },
  {
    name:'Franchini',
    firstname:'Thibault',
    email:'tfranchini@smartadserver.com',
    amount:3,
    delta:6,
    paid:15
  },
  {
    name:'Giron dit Metaz',
    firstname:'Loïc',
    email:'lgironditmetaz@smartadserver.com',
    amount:3,
    delta:8
  },
  {
    name:'Gomez',
    firstname:'Julien',
    email:'jgomez@smartadserver.com',
    amount:2.5,
    delta:15,
    paid:25.90
  },
  {
    name:'Jaquemin',
    firstname:'Antoine',
    email:'ajacquemin@smartadserver.com',
    amount:1,
    delta:8
  },
  {
    name:'Jouin',
    firstname:'Christophe',
    email:'cjouin@smartadserver.com',
    amount:3,
    delta:17
  },
  {
    name:'Khalfallaoui',
    firstname:'Maxime',
    email:'mkhalfallaoui@smartadserver.com',
    amount:3,
    delta:0
  },
  {
    name:'Lassalle',
    firstname:'Phil',
    email:'plassalle@smartadserver.com',
    amount:5,
    delta:1
  },
  {
    name:'Laurent',
    firstname:'Clémence',
    email:'claurent@smartadserver.com',
    amount:2,
    delta:12
  },
  {
    name:'Macque',
    firstname:'Olivier',
    email:'omacque@smartadserver.com',
    amount:4,
    delta:24
  },
  {
    name:'Nachawati',
    firstname:'Benoit',
    email:'nachos@smartadserver.com',
    amount:1,
    delta:7
  },
  {
    name:'Nanmegni',
    firstname:'Elisée',
    email:'enanmegni@smartadserver.com',
    amount:3,
    delta:18
  },
  {
    name:'Pasquali',
    firstname:'Mathilde',
    email:'mpasquali@smartadserver.com',
    amount:2,
    delta:17
  },
  {
    name:'Pironon',
    firstname:'David',
    email:'dpironon@smartadserver.com',
    amount:1,
    delta:-3
  },
  {
    name:'Prodhomme',
    firstname:'Boris',
    email:'bprodhomme@smartadserver.com',
    amount:3,
    delta:18
  },
  {
    name:'Rondel',
    firstname:'Amandine',
    email:'arondel@smartadserver.com',
    amount:2,
    delta:11
  },
  {
    name:'Ruffin',
    firstname:'Stéphane',
    email:'stephane.ruffin@smartadserver.com',
    amount:1,
    delta:1
  },
  {
    name:'Sanchez',
    firstname:'Benoit',
    email:'bsanchez@smartadserver.com',
    amount:3,
    delta:18
  },
  {
    name:'Taulera',
    firstname:'Kevin',
    email:'ktaulera@smartadserver.com',
    amount:3,
    delta:0
  },
  {
    name:'Tellier',
    firstname:'Sébastien',
    email:'stellier@smartadserver.com',
    amount:4,
    delta:12,
    paid:24
  },
  {
    name:'Timsit',
    firstname:'Cédric',
    email:'ctimsit@smartadserver.com',
    amount:2,
    delta:8
  },
  {
    name:'Traversian',
    firstname:'Alexandre',
    email:'atraversian@smartadserver.com',
    amount:1,
    delta:-12,
    paid:0
  },
  {
    name:'Villalta',
    firstname:'Xavier',
    email:'xvillalta@smartadserver.com',
    amount:3,
    delta:0,
    paid:10
  },
  {
    name:'Zaroual',
    firstname:'Hajar',
    email:'hzaroual@smartadserver.com',
    amount:3,
    delta:18
  }
];

 json.forEach(function(user, i) {
    console.log(user.name);
    var userId =  CoffeeUsers.insert({
        name: user.name,
        firstname: user.firstname,
        amount: user.amount,
        email: user.email,
        killed: 0
    }); 
     Lines.insert({
        factureId: decemberBill,
        coffeeUserId: userId,
        coffee: user.amount,
        paid: (user.paid > 0),
        payement: user.paid,
        delta: user.delta,
        amount: 0,
        reminder: 1
    }); 
 });
}


