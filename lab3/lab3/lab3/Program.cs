using System;

namespace lab3
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine(new Random().Next(0));
            Console.WriteLine("Task 2");
            task2();

            Console.WriteLine("Task 3");
            task3();

        }

        private static void task3()
        {
            Casino casino = new Casino();

            casino.createAcc();

            uint[] outputs = new uint[624];

            for(int i=0; i < 624; i++)
            {   
                var currentRes = casino.play("BetterMt", 1, 1);
                outputs[i] = currentRes.realNumber;
            }

            var mt = new MT();
            mt.Seed(0);

            uint[] untemperedValues = new uint[624];

            for(int i=0; i < 624; i++)
            {
                untemperedValues[i] = mt.Untemper((int)outputs[i]);
            }
                
            mt.mt = untemperedValues;

            var res = casino.play("BetterMt", 1, mt.ExtractNumber());

            Console.WriteLine($"result {res.message}");
        }

        private static void task2()
        {

            uint seed = (uint)DateTimeOffset.UtcNow.ToUnixTimeSeconds(); 
            Casino casino = new Casino();

            casino.createAcc();

            MT mt = new MT();
            mt.Seed(seed - 1);
            Response res = casino.play("Mt", 1, mt.ExtractNumber());
               

            uint i = 0;
            while (i <= 20)
            {
                seed += i;
                mt.Seed(seed);

                uint extractNum = mt.ExtractNumber();

                Console.WriteLine($"extract - {extractNum}, real - {res.realNumber}");
                if (extractNum == res.realNumber)
                {
                    Console.WriteLine($"seed - {seed}");
                    res = casino.play("Mt", 1, mt.ExtractNumber());
                    Console.WriteLine($"result {res.message}");
                    return;
                }
                i++;
            }

        }
    }
}
