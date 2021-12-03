using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;

namespace lab3
{
    public class Casino
    {
        public string url = "http://95.217.177.249/casino";

        public int id;

        public Account acc;

        public Casino()
        {
            id = getRandomNumber();
            //id = 8212;
        }

        public void createAcc()
        {
            acc = new Account();

            WebRequest request = WebRequest.Create($"{url}/createacc?id={id}");
            request.Credentials = CredentialCache.DefaultCredentials;

            WebResponse response = request.GetResponse();

            using (Stream dataStream = response.GetResponseStream())
            {
                StreamReader reader = new StreamReader(dataStream);
                string responseFromServer = reader.ReadToEnd();
                acc = JsonConvert.DeserializeObject<Account>(responseFromServer);
                Console.WriteLine(id);
            }

        }


        public Response play(string mode, decimal bet, uint number)
        {
            var res = new Response();

            WebRequest request = WebRequest.Create($"{url}/play{mode}?id={id}&bet={bet}&number={number}");
            request.Credentials = CredentialCache.DefaultCredentials;

            WebResponse response = request.GetResponse();

            using (Stream dataStream = response.GetResponseStream())
            {
                StreamReader reader = new StreamReader(dataStream);
                string responseFromServer = reader.ReadToEnd();
                res = JsonConvert.DeserializeObject<Response>(responseFromServer);
               
            }

            return res;
        }

        public int getRandomNumber()
        {
            Random rnd = new Random();
            return rnd.Next(1, 100000);
        }
    }
}
