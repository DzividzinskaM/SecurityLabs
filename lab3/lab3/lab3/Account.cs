using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace lab3
{
    public class Account
    {
        [JsonPropertyName("id")]
        public string id { get; set; }

        [JsonPropertyName("money")]
        public decimal money { get; set; }

        [JsonPropertyName("delationTime")]
        public string delationTime { get; set; }

    }
}
