CREATE TABLE IF NOT EXISTS users (
    uuid UUID PRIMARY KEY NOT NULL DEFAULT GEN_RANDOM_UUID(),
    name VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL,
    avatar VARCHAR(255),

    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP
);


INSERT INTO users (name, email, password) VALUES ('blidgley0', 'cglendza0@desdev.cn', '$2a$04$xSSBNwR5oVMZYhD.ia5VWug59WJVGz8a3vzUINvu8EGbr4Cb1BPha');
INSERT INTO users (name, email, password) VALUES ('hgilbane1', 'gmcguinley1@ebay.com', '$2a$04$pu9kYYx6u7BtfdkEyChz8.Ful.KksJBya83K4S20M7l8D7UP.40Wa');
INSERT INTO users (name, email, password) VALUES ('hanniwell2', 'amcveagh2@google.ru', '$2a$04$UwPG/R6qnJeP/j1NkJvV2eauExo8TWLxZ261D7Xl6oZeiyfYyJAUe');
INSERT INTO users (name, email, password) VALUES ('cfelix3', 'vchadwen3@aboutads.info', '$2a$04$hS6UEcgMZ5.38yWI3MJPMOBo8k4kvCEA.zRD1bijw/CvMYlj7tbn2');
INSERT INTO users (name, email, password) VALUES ('pheifer4', 'tvarfalameev4@1688.com', '$2a$04$HhAi/tLuuWkGMSG72Bx4T.U/6qnA524aezurcsUJAIAbH6YWRSj4u');
INSERT INTO users (name, email, password) VALUES ('nmarcham5', 'cperello5@storify.com', '$2a$04$bX7snFXnbwb86eihxSDwUO.gAvYHeNrViEJj3Gs0ZmAtXveY2AQLS');
INSERT INTO users (name, email, password) VALUES ('dhansbury6', 'rnuzzi6@tripod.com', '$2a$04$VQqrUl2Y/WPFL7iQewmCouHQ9aqrzoPkvZRUABw13MyVDEcER0zd6');
INSERT INTO users (name, email, password) VALUES ('dmattingley7', 'cravens7@wufoo.com', '$2a$04$EwRl1aF9zj.g/ZZg1iy8rOK5R0mVeb8Qmk0vjEFb33yBwBIHo2/JC');
INSERT INTO users (name, email, password) VALUES ('jchandlar8', 'dclawsley8@tuttocitta.it', '$2a$04$vih0kfqAi6Dpar0yS061OOmNw5k..BWod2LuHFRgf3dAOZQpGimtS');
INSERT INTO users (name, email, password) VALUES ('cdutt9', 'aoshiels9@vistaprint.com', '$2a$04$SofAfDd8uaN7m.OFD0d4XefrStZbqc/l5qx3c8WN2sw9oV42LcTUq');
INSERT INTO users (name, email, password) VALUES ('bpafforda', 'fscardefielda@mlb.com', '$2a$04$sXXAWOURq/EohTd.dEpzwOZVwHDoj8KRXftzloe1nUJhF8WwCuuVm');
INSERT INTO users (name, email, password) VALUES ('anieldb', 'dloughanb@slate.com', '$2a$04$JQTUJYUNp2UmyoXSi63ObuQwVcYPyx4jqu4oRY2zwTwjIkbNtDk8y');
INSERT INTO users (name, email, password) VALUES ('jyesipovc', 'jtorresic@usnews.com', '$2a$04$Zg463gJ6gED366AWneESi.zDu6bfbKRLFbZZi.Y4fLDungXEm3b.m');
INSERT INTO users (name, email, password) VALUES ('gbenoeyd', 'daired@wisc.edu', '$2a$04$YA9WGYFRhmT8QLaP6nfdyegEEbMSh.KOzqZdkiQTOt1Tx5bOSyjgW');
INSERT INTO users (name, email, password) VALUES ('pprujeane', 'mmillere@gmpg.org', '$2a$04$nVf5gkj1ByWQFisT2NVeqOuZJQqLffBGHadVUztpgfIT75Ob3CEmS');
INSERT INTO users (name, email, password) VALUES ('jbaldacchinof', 'dsleggf@fema.gov', '$2a$04$E0JNauQk0F.Z/wEFAViZeeXd/h.SA0F2qinlFc4gPQiqyMQBQcaP.');
INSERT INTO users (name, email, password) VALUES ('medmonsg', 'mkiffing@ucoz.com', '$2a$04$U.EWtVBIauomfRm3AjNkyeNWODysBXHMKYtXDAJ6qAzlBH9D/Va.m');
INSERT INTO users (name, email, password) VALUES ('sgillbeh', 'prumminh@slashdot.org', '$2a$04$H7H6kUgRVt5tkkGeqDakFuelxE4YEYIt9h2boSUvmp6O5oRcD7OIG');
INSERT INTO users (name, email, password) VALUES ('pheatheri', 'bhanneyi@4shared.com', '$2a$04$1UgH3BfgRUSY6M80fx16.OXhFWo5PjQIkQl9PMcdioxEGh3RJzsCe');
INSERT INTO users (name, email, password) VALUES ('okinradej', 'cmchughj@skyrock.com', '$2a$04$.IR6T33LJdCCVwkNLpsNdueANyG11LXDuVAitIDgsmBfjtpkkwuMO');
INSERT INTO users (name, email, password) VALUES ('vhamssonk', 'jbarklyk@acquirethisname.com', '$2a$04$DzhnKQYQ4upuLyy0vRDQgOxANfqrjXWHayw3HBq5zimJhu.8PVc.a');
INSERT INTO users (name, email, password) VALUES ('lgoodingl', 'jmehmetl@boston.com', '$2a$04$A4.pkcWqltXCv.nJjxCju.wmoDfSa5avnJBV61kK.BFBquFowqLWG');
INSERT INTO users (name, email, password) VALUES ('bhugnetm', 'rmcguirem@stanford.edu', '$2a$04$Dn5JH/bL.fe9woQm8sNgu.ArYboTrIGqGBs79zauqB1EXEOsbGdD2');
INSERT INTO users (name, email, password) VALUES ('warpurn', 'ewraithn@baidu.com', '$2a$04$ztWImrrY5Y71eC63YwrGn.Y87llyLzEDrmjTQSlvJFq7bsFisYiMi');
INSERT INTO users (name, email, password) VALUES ('cfuggleo', 'zmunkleyo@aol.com', '$2a$04$hzgxZtl4FeYG5PPANXuU8uu/PKkoH39UMGjbLPgiSvDvLCIbibR7C');
INSERT INTO users (name, email, password) VALUES ('ephilipetp', 'sarmourp@cocolog-nifty.com', '$2a$04$5Qd0IpexQ0HJWZznZs6g2.QolUBKtbZywZ5BNb4BK/Ji3Nx6OWY2.');
INSERT INTO users (name, email, password) VALUES ('rsageq', 'bpeartonq@pbs.org', '$2a$04$55f66102QaeILhAPfd4SJOf5p47zfGQjO.E/E0Kd5QKJxHCcQlKfK');
INSERT INTO users (name, email, password) VALUES ('dhyslopr', 'jwydr@nature.com', '$2a$04$c.QVUaVcaxL2l3VF8eLnn.MtVKgQ1HgXMam/k9igsSPJJxkwRpM1m');
INSERT INTO users (name, email, password) VALUES ('vhubeauxs', 'tcanters@cafepress.com', '$2a$04$gEe90IDs7c8MH4JIKOUYe.y6zSckQA/AWGV3nyLxYX1nSD3heQfwe');
INSERT INTO users (name, email, password) VALUES ('pbattisont', 'lleant@wunderground.com', '$2a$04$khd0iQkavWrx/VKpVoRVoO.1i5K18pzDSAZun5jgDfHJdXih9JXNO');
INSERT INTO users (name, email, password) VALUES ('fgwilymu', 'kdanielouu@printfriendly.com', '$2a$04$6SvFrD.cG2p3l8rlJ8o7u.ljXCHqLNCwTIWlueGUk1LoF87xqoEgq');
INSERT INTO users (name, email, password) VALUES ('hjacombv', 'esepeyv@goo.gl', '$2a$04$z3152CAG9P5ylVan6Hc3suU3DRA1OU6CRZTvc6vwN8brVuKCudHs.');
INSERT INTO users (name, email, password) VALUES ('broisenw', 'jmcrannellw@hugedomains.com', '$2a$04$Pnl8MxZntW7rH4BNUm.GKOPdV8cVklYWba5ohXwmIdWaaT/j7y4Fu');
INSERT INTO users (name, email, password) VALUES ('ebeanyx', 'areiachx@bigcartel.com', '$2a$04$Gb1fOZZftt3IxfB/vtXmE.fUzlRImxyGaLTyeMYqxDV77VzFYpyOa');
INSERT INTO users (name, email, password) VALUES ('cambroziky', 'vbottomy@dailymail.co.uk', '$2a$04$dx.PRb9epf6ygGUsGeCWvOywTHF56G4XI7QX79HpcXhIB3ISDw7XS');
INSERT INTO users (name, email, password) VALUES ('kmuckianz', 'squadrioz@about.me', '$2a$04$Kc8dnGyRTEulofu0Rh3h0uQowFGVzcZbdmMlYNzFZz6X6GA0QQLeO');
INSERT INTO users (name, email, password) VALUES ('ksutherland10', 'gpaggitt10@abc.net.au', '$2a$04$IP3jifSFNVGohsXI9hZDTeKCj8VKRLdtyFECa9EQPT4Woy6DBG6iW');
INSERT INTO users (name, email, password) VALUES ('ddepport11', 'bdaborne11@shinystat.com', '$2a$04$ujuL2u3ho0/6Pb0X4i0ZfOlSmtvulnEGBV1OP9bVo3A//xC47RoCq');
INSERT INTO users (name, email, password) VALUES ('atreadaway12', 'tive12@sphinn.com', '$2a$04$dFl3ezkwoSSzY8iCMqEjJ.ht/.3ob/dBUohMB7P0efgP71TrdfXzy');
INSERT INTO users (name, email, password) VALUES ('cspilling13', 'tmateja13@smh.com.au', '$2a$04$reIva.677olphh124afSAeOerI44oEjBvM5GcXCgHq8i3Y6uPuM7u');
INSERT INTO users (name, email, password) VALUES ('iprandin14', 'rgrimbleby14@time.com', '$2a$04$/hH.lw0Sq/4YnNR9nphWo.SjAuKniTVq/w2kgW0bg/gbcbWDhCQIS');
INSERT INTO users (name, email, password) VALUES ('bpiggrem15', 'bchandler15@trellian.com', '$2a$04$6KKk1fsm/Tw10Ov7YqaxdeIRD8cBz1BMY3q3Xl8hv2Kwmb22Tw8O2');
INSERT INTO users (name, email, password) VALUES ('cpottberry16', 'bsincock16@bbb.org', '$2a$04$X2/H7HEhU9jLUJjEF81p9eIyzfemN2saW.7SJ3p8CHwC28.KYWM5y');
INSERT INTO users (name, email, password) VALUES ('dcopcutt17', 'cmcguiness17@nsw.gov.au', '$2a$04$rGy4H404Z5W7D0LZAlB2w.XQcdqEnFeSnFQfm3UPloiTtlevU.AYq');
INSERT INTO users (name, email, password) VALUES ('evancastele18', 'cbednall18@archive.org', '$2a$04$f68clv2aPigq/KQsg4zlF.zpSHfblQCju1gxjnVWgsIeQLnIpYxFu');
INSERT INTO users (name, email, password) VALUES ('gcowp19', 'amacskeaghan19@issuu.com', '$2a$04$01wqaDvLXdOGn6zEOOoem.pmnG.aS7UADkpcdLGwRJ/dkaYV.hpIK');
INSERT INTO users (name, email, password) VALUES ('cmacguffie1a', 'fvasilchikov1a@yale.edu', '$2a$04$u3RbImLrgyf4jUtyd1YzuuXbaqFmY/Up0vA..WBG8mJ4Ihn.wm85a');
INSERT INTO users (name, email, password) VALUES ('yskeels1b', 'cbault1b@cargocollective.com', '$2a$04$Ax6VlaYzZ3Ycrd3ql87qvOGnfcfg9vSSH7Pz8XcfJKZK.lqHuZPX6');
INSERT INTO users (name, email, password) VALUES ('jbuxam1c', 'tfaulconbridge1c@ucoz.ru', '$2a$04$XKbauq/DmFbugFb38hXWBeBO37//S9IxiOib5dsTJo2WcsqQ6t/VW');
INSERT INTO users (name, email, password) VALUES ('lwooster1d', 'ctrask1d@columbia.edu', '$2a$04$Fp9ZwaWH5ow8zqX4yvHM7umaDRauUm5oKkmdOgc8xzLO7c0TPUpci');
INSERT INTO users (name, email, password) VALUES ('mmacdermot1e', 'jwythe1e@biblegateway.com', '$2a$04$fC/VO6mpGAjvgZSYVOEZjezVZ8W.lzMWME..fo2Rl1embKC3XIewq');
INSERT INTO users (name, email, password) VALUES ('bshackleton1f', 'dbedell1f@topsy.com', '$2a$04$rGOYbIvMKIKYshJdjCmyXOi9y6Kk3WgRH4qmuKPkKtKbDQZFiRAoW');
INSERT INTO users (name, email, password) VALUES ('rreaper1g', 'mhalsho1g@ted.com', '$2a$04$L.fw4ZrEDXgrN/LI25rJU.8aoPvMryiA4zaIGEGN1coHEl3mBqbue');
INSERT INTO users (name, email, password) VALUES ('bcruft1h', 'sfarland1h@loc.gov', '$2a$04$OoP.EYMiUVTvd0HGUXBFKep1ipAgZ39lRwYf53/IUKOvUa9XDwTIK');
INSERT INTO users (name, email, password) VALUES ('jmulrean1i', 'ssteen1i@va.gov', '$2a$04$wTx29Cvy8uJSe/R9XNNNd.CDXOVnltTL3k057CNq1MFHWGxTYSl/W');
INSERT INTO users (name, email, password) VALUES ('ceggleton1j', 'asayce1j@hc360.com', '$2a$04$ZqJXVuq4Br2DILjMtGfp2uvBxZQ.TI9QNy8mSdg/DntNplg2WaOL2');
INSERT INTO users (name, email, password) VALUES ('tgillyett1k', 'bhealing1k@tinyurl.com', '$2a$04$hf0xlWWdN4LJWjvPBNmipeKY45ydzNQvP829BAStgOKkvgY7rKUgC');
INSERT INTO users (name, email, password) VALUES ('hbaldin1l', 'gsommerly1l@census.gov', '$2a$04$pUwOSxxgZhqsgyUTylO87ebEtV5dWewcxNkQf7bhUPuD9PD/hBOfa');
INSERT INTO users (name, email, password) VALUES ('bbartalin1m', 'mscanlon1m@mlb.com', '$2a$04$gLtEoqpIv9UfJ8hsI/c99ORiQFZwsS.4znG7ZEGIoBzX.dQps0Lm.');
INSERT INTO users (name, email, password) VALUES ('dandrioletti1n', 'zcatlin1n@livejournal.com', '$2a$04$LzxYuzrhlut9s9FF53YkJONXn41n0yinf5Ze7U3MHacT.9n4WseYu');
INSERT INTO users (name, email, password) VALUES ('isoles1o', 'rdobbin1o@boston.com', '$2a$04$M6JlidTvDWxkRpEW5D6GxeDDQ88qefBkue/IvjzwyMbpnp/zs4ZuC');
INSERT INTO users (name, email, password) VALUES ('ebanville1p', 'dmaleney1p@liveinternet.ru', '$2a$04$Fz20bf675vmPoc3KA3KP9ebTDA6h07RODNS.ZRSh9VVvBSQbXeMw.');
INSERT INTO users (name, email, password) VALUES ('mughini1q', 'jasaaf1q@paypal.com', '$2a$04$3QOXc8y2gN/rshUTikTfFOAHIdtLcTXo/pLQXUjXIxPkGu3/0vDTe');
INSERT INTO users (name, email, password) VALUES ('pgabotti1r', 'lchazette1r@biblegateway.com', '$2a$04$GU2oMD6cJFBgqvCub6x7WeKRgZT1CHJMieNW.fFWi.kJCO5bNYxae');
INSERT INTO users (name, email, password) VALUES ('lduinkerk1s', 'epape1s@rediff.com', '$2a$04$.pPCg7S4k.RcSIhzTJN35OcOOEIIx7gZl56Mmf/jl8B.f7TtwxdjC');
INSERT INTO users (name, email, password) VALUES ('lnasey1t', 'lrichard1t@squarespace.com', '$2a$04$25orCwBznQMmG4Enrhob1uSOtYi7NeqeS8jfXGpf9eD0nIVaTRQU2');
INSERT INTO users (name, email, password) VALUES ('opretti1u', 'hoag1u@go.com', '$2a$04$p1QsoHAmM3JUVHhYR01Ouep4Qg9LagDvF4DUwbea.4eWhBqKgW54y');
INSERT INTO users (name, email, password) VALUES ('nlindmark1v', 'coruane1v@topsy.com', '$2a$04$udox4PCGFjhvkh3wyW7ixOGAcFCw5d1HEWTrNJiNZEuxhN/3wM/Vq');
INSERT INTO users (name, email, password) VALUES ('dgillie1w', 'mnew1w@goo.gl', '$2a$04$uB5cvNo/BUTe/wgNUfjBTOufhJkMuO76wkGheHbsxB/MnvxAx7pWq');
INSERT INTO users (name, email, password) VALUES ('vwibrow1x', 'hlethbrig1x@bloglovin.com', '$2a$04$B8T/LCHCA/Rb/.SGtAVbn.7IjkG3t3czJMvY14vsd0Q0fvPLUc/4C');
INSERT INTO users (name, email, password) VALUES ('tbustard1y', 'hnemchinov1y@utexas.edu', '$2a$04$L7s65zloy0o8wGQeQ1sWAO8B1J9TcBWzHDugA5nnjJGgjL.KlL.bG');
INSERT INTO users (name, email, password) VALUES ('lgiannotti1z', 'creville1z@t-online.de', '$2a$04$6xtt2XRBDV6PHMP2r3abaud61psLqzpSUath1b9NMU4om/wZXz2OG');
INSERT INTO users (name, email, password) VALUES ('mgrogan20', 'msavatier20@go.com', '$2a$04$kFOmZWXi9o0iLJFTiF8Cp.dwJiwtgkIne/KROLMAdUm0cO68V3B1.');
INSERT INTO users (name, email, password) VALUES ('jvido21', 'asimacek21@tumblr.com', '$2a$04$iOxgiQYzP6NzsoXFnsCwRuGzW2QJCh3OX5GIQpR3piatrJ4oUwdwa');
INSERT INTO users (name, email, password) VALUES ('elayborn22', 'wpietruschka22@exblog.jp', '$2a$04$.YhwOn6nb2g8BFSo1swOSuACM6jEv1Lom2I5B0kgQAdS6rIyQ2qsy');
INSERT INTO users (name, email, password) VALUES ('ccristou23', 'hnisius23@icq.com', '$2a$04$N0W0C.WaL2mv1DVf.Iczi.hAumPAxrQD0eVgz2Y4q63eY5MOXaTP.');
INSERT INTO users (name, email, password) VALUES ('kwithringten24', 'tcromar24@ucoz.ru', '$2a$04$6p0fZB89ilQRla6bTww3O.rgmuflz8qxrWw2Kc5xhTwcheKIRTO8S');
INSERT INTO users (name, email, password) VALUES ('condrusek25', 'mghiotto25@newyorker.com', '$2a$04$R0XQPhOoKRr8duZE1Xv/r.ui8ytNXwLNJG74EKUfs/4PoFxtb0b0K');
INSERT INTO users (name, email, password) VALUES ('vbendig26', 'ekohnert26@friendfeed.com', '$2a$04$G74bgXIX1NtQigKof6sWOeJ1U5dHK.pcIzVOp6ezbGVfv9OePKacy');
INSERT INTO users (name, email, password) VALUES ('mmowles27', 'wbreacher27@google.co.jp', '$2a$04$nYZSBxyL1pMs6YBTQFydguEJaNWFKjry2u8xnp0Tzi6ysZOrNpvle');
INSERT INTO users (name, email, password) VALUES ('jcuttin28', 'apenhalurick28@illinois.edu', '$2a$04$tSGq0611mQuG7QrKYa4JbOr4mwNuivHvmq77hy5AjB0x2ENhrZuY2');
INSERT INTO users (name, email, password) VALUES ('atante29', 'kfeasley29@admin.ch', '$2a$04$Ei.4EWOnLy4kReQo4zeTvuR5GtxVX.AsN8Muahojj74Vfq3oXdMBO');
INSERT INTO users (name, email, password) VALUES ('tmccaughen2a', 'rpablo2a@cam.ac.uk', '$2a$04$x79itNIM66CbU6Zse2DVeO7Kim./ZijUNd7cpaMyDkG5plqOSq3J6');
INSERT INTO users (name, email, password) VALUES ('rstranieri2b', 'bsibille2b@rakuten.co.jp', '$2a$04$XCNSTJI8mL18nfUUDaK13uObBua9wIWJ7ezEVcTQ5yp4uB47bWdga');
INSERT INTO users (name, email, password) VALUES ('celgram2c', 'tgeeritz2c@constantcontact.com', '$2a$04$NnFxgQYm99W/6Jnx4FRvcOsRO0gCs0ywqEEC/mkgAo0F5ckr9XSgO');
INSERT INTO users (name, email, password) VALUES ('lrikard2d', 'abremner2d@cargocollective.com', '$2a$04$zlZFtdSwVmCY35yqat.mkugkgeotfjUdd3dMKdT2.ziRJe9h8F6W2');
INSERT INTO users (name, email, password) VALUES ('scrouch2e', 'slammenga2e@vinaora.com', '$2a$04$Omn5rMY8Xx2S5Bujc7Vz1.ocz7Kl6M/.442JUAiuC8LIHUSjCm5pm');
INSERT INTO users (name, email, password) VALUES ('ddrewett2f', 'aesselin2f@businessweek.com', '$2a$04$xEiEGoPE9tigTvcg/aHxJu44WflOAEDSag6kYVBpbJmEk9/cIGSXO');
INSERT INTO users (name, email, password) VALUES ('tadnam2g', 'tclemits2g@latimes.com', '$2a$04$4IntcKtXaO7ZdpAzuyCRy.Sv.qZucbtFXpRLmZXlT1I/CEud5Rc/K');
INSERT INTO users (name, email, password) VALUES ('jocahsedy2h', 'fmaccorkell2h@xinhuanet.com', '$2a$04$Ouv4Dle69cBEDJTvWz4ugOVBPKo4jnqetz24me0h4.OtM6E2QtJq6');
INSERT INTO users (name, email, password) VALUES ('afulbrook2i', 'gmeale2i@yelp.com', '$2a$04$DOa77k98Keoq6SqV6pMqIeLaUCq6Ls1V0QhijZwPVbgfpCSVA6YA6');
INSERT INTO users (name, email, password) VALUES ('nfishbourn2j', 'ldraisey2j@ucla.edu', '$2a$04$ovWNrkRjj0Cj0.mziC8x2OI8TPx2SJURhwSO67R4fAMgDMSeZc4Rq');
INSERT INTO users (name, email, password) VALUES ('jhencke2k', 'fmatteuzzi2k@go.com', '$2a$04$rY96lqnyoWi2Aj/KozRfa.JnMInMeiW2P4zJfo8kky90i.cZkBJPK');
INSERT INTO users (name, email, password) VALUES ('cborrow2l', 'eprice2l@artisteer.com', '$2a$04$6SMB2N7W3z/prdWYjnY1OuYZcHX1XePnSEmF1bLM.OJiOkEaSQFCq');
INSERT INTO users (name, email, password) VALUES ('llandsborough2m', 'pclampe2m@unesco.org', '$2a$04$JwdoIWl8usxt/89xY84HbuyTWJCMLP2T1osePRP74uW1P.iDAJYna');
INSERT INTO users (name, email, password) VALUES ('kitzhayek2n', 'fscrimshire2n@moonfruit.com', '$2a$04$yi.UAZsFqZRzSre5jR28..x0Y/guYN0FD.d1ZfOxjF1pwmkpwhYPm');
INSERT INTO users (name, email, password) VALUES ('bredding2o', 'jvanderhoog2o@time.com', '$2a$04$IA1b9zhI8lY5qrLlPQ.ON.pCZ3LtYEkp3GZQNZhljQz8FUtFtt4Fm');
INSERT INTO users (name, email, password) VALUES ('rburchard2p', 'psivior2p@hao123.com', '$2a$04$D1PRRNYXSSrPFZEWbgm8kOPR7czMlgxBUPDE4TMKpcH1SnudJItKS');
INSERT INTO users (name, email, password) VALUES ('jdavidzon2q', 'dledrun2q@bloglines.com', '$2a$04$JMJnf1gankUGtaJoqZ3cc.es3PLS9VCn195Z/xFGBchp1wItBriC.');
INSERT INTO users (name, email, password) VALUES ('bduffan2r', 'sgidden2r@engadget.com', '$2a$04$baHvcMp7lMszjMLXxewE8eaxr/Vp6JcIKgIBDKMjLVtDWkOC71tM6');
INSERT INTO users (name, email, password) VALUES ('zsilbert2s', 'cohlsen2s@pcworld.com', '$2a$04$1TqQmlkRAS90Sw6tYiozMOj.9UACpoBwz4uXudidu1fyNvjhfkwJy');
