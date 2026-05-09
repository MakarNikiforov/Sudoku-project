
class Pojazd {
    protected String marka;
    protected String model;
    protected int rok;

    public Pojazd(String marka, String model, int rok) {
        this.marka = marka;
        this.model = model;
        this.rok = rok;
    }

    public void uruchom() {
        System.out.println("Pojazd uruchomiony.");
    }
}


class Samochod extends Pojazd {

    public Samochod(String marka, String model, int rok) {
        super(marka, model, rok);
    }

    @Override
    public void uruchom() {
        System.out.println("Samochód " + marka + " " + model + " bzyczy.");
    }
}


class Motocykl extends Pojazd {

    public Motocykl(String marka, String model, int rok) {
        super(marka, model, rok);
    }

    @Override
    public void uruchom() {
        System.out.println("Motocykl " + marka + " " + model + " brumi.");
    }
}


class Ciezarowka extends Pojazd {
    private double ladownosc;

    public Ciezarowka(String marka, String model, int rok, double ladownosc) {
        super(marka, model, rok);
        this.ladownosc = ladownosc;
    }

    @Override
    public void uruchom() {
        System.out.println("Ciężarówka " + marka + " " + model +
                " z ładownością " + ladownosc + "t rusza ciężko.");
    }
}


public class Main {
    public static void main(String[] args) {


        Pojazd[] flota = new Pojazd[] {
                new Samochod("Tesla", "Model 3", 2022),
                new Motocykl("Yamaha", "R1", 2020),
                new Ciezarowka("Volvo", "FH16", 2018, 25)
        };


        for (Pojazd p : flota) {
            p.uruchom();
        }
    }
}